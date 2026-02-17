import { Car } from "../models/carModel.js";
import { Booking } from "../models/bookingModel.js";
import { redisClient } from "../app.js";
import mongoose from "mongoose";
import cron from "node-cron";
import Stripe from "stripe";

/**
 * Redesign for Production-Level Booking & Inventory Management
 * 
 * Strategy:
 * 1. Distributed Locking: Uses Redis to prevent race conditions at the API level.
 * 2. MongoDB Transactions: Ensures ACID compliance for booking creation and multi-document updates.
 * 3. Dynamic Availability: Check overlaps against confirmed and active pending bookings.
 * 4. Idempotency: Uses a hash of carId, userId, and date range to prevent duplicate clicks.
 */

// Helper: Check if car is available for a given range
const checkCarAvailability = async (carId, startDate, endDate, session = null) => {
  const bufferTime = 10 * 60 * 1000; // 10 minutes for pending bookings
  const now = new Date();
  
  // A booking is "blocking" if it is confirmed OR (pending and not yet expired)
  const overlappingBookings = await Booking.find({
    car: carId,
    $or: [
      { status: "confirmed" },
      { 
        status: "pending", 
        createdAt: { $gte: new Date(now.getTime() - bufferTime) } 
      }
    ],
    // Date overlap logic: (S1 < E2) AND (E1 > S2)
    rentalStartDate: { $lt: endDate },
    rentalEndDate: { $gt: startDate }
  }).session(session);

  return overlappingBookings.length === 0;
};

export const booked = async (req, res) => {
  const session = await mongoose.startSession();
  const {
    regNumber,
    rentalStartDate,
    rentalEndDate,
    paymentMethod,
    rentalLocation,
  } = req.body;

  const userId = req.user.id;
  
  // LOCK KEY for Redis (Distributed Lock)
  const lockKey = `lock:car_booking:${regNumber}`;
  const idempotencyKey = `idempotency:booking:${userId}:${regNumber}:${rentalStartDate}:${rentalEndDate}`;

  try {
    // 1. Idempotency Check
    const isDuplicate = await redisClient.get(idempotencyKey);
    console.log(`[DEBUG] Idempotency Key: ${idempotencyKey}, Value: ${isDuplicate}`);
    if (isDuplicate) {
      console.log(`[DEBUG] Duplicate request detected.`);
      return res.status(409).json({ message: "Duplicate booking request. Please check your account." });
    }

    // 2. Acquire Redis Lock (TTL 30s for the transaction window)
    const acquiredLock = await redisClient.set(lockKey, "locked", { nx: true, ex: 30 });
    if (!acquiredLock) {
      return res.status(423).json({ message: "Vehicle is currently being processed by another user. Try again in a moment." });
    }

    // 3. Start Transaction
    session.startTransaction();

    const car = await Car.findOne({ regNumber }).session(session);
    if (!car) {
      throw new Error("Car not found.");
    }

    if (car.status !== "active") {
      throw new Error(`Vehicle is currently ${car.status} and cannot be booked.`);
    }

    // Convert to UTC/Dates
    const startDate = new Date(rentalStartDate);
    const endDate = new Date(rentalEndDate);
    const now = new Date();

    // Validation
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format.");
    }
    if (startDate < now) {
      throw new Error("Cannot book in the past.");
    }
    if (startDate >= endDate) {
      throw new Error("Drop-off date must be after pick-up date.");
    }

    // 4. Dynamic Availability Check
    const isAvailable = await checkCarAvailability(car._id, startDate, endDate, session);
    if (!isAvailable) {
      throw new Error("Vehicle is already booked for the selected time window.");
    }

    // 5. Create Pending Booking
    const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
    const priceSnapshot = car.rentalPricePerDay;
    const totalPrice = rentalDays * priceSnapshot;

    const newBooking = new Booking({
      user: userId,
      car: car._id,
      regNumber,
      rentalStartDate: startDate,
      rentalEndDate: endDate,
      totalPrice,
      priceSnapshot,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      rentalLocation: {
        pickupLocation: rentalLocation.pickupLocation,
        dropoffLocation: rentalLocation.dropoffLocation,
      },
    });

    await newBooking.save({ session });

    // 6. Set Idempotency (TTL 5 minutes)
    await redisClient.set(idempotencyKey, newBooking._id.toString(), { ex: 300 });

    // 7. Invalidate Cache for Car Listings (Availability has changed)
    const keys = await redisClient.keys("cars_query_*");
    const userKeys = await redisClient.keys(`user_bookings_${userId}_*`);
    if (keys.length > 0) await redisClient.del(...keys);
    if (userKeys.length > 0) await redisClient.del(...userKeys);

    // Also invalidate Owner's caches
    if (car && car.ownerId) {
      const ownerIdStr = car.ownerId.toString();
      const ownerKeys = await redisClient.keys(`owner_bookings_${ownerIdStr}_*`);
      const recentKeys = await redisClient.keys(`owner_recent_bookings_${ownerIdStr}`);
      if (ownerKeys.length > 0) await redisClient.del(...ownerKeys);
      if (recentKeys.length > 0) await redisClient.del(...recentKeys);
    }

    await session.commitTransaction();
    
    return res.status(201).json({
      message: "Temporary reservation created. Please complete payment within 10 minutes.",
      booking: newBooking,
      expiresAt: new Date(now.getTime() + 10 * 60 * 1000)
    });

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("Booking Error:", error.message);
    return res.status(error.message.includes("available") || error.message.includes("booked") ? 409 : 400).json({ message: error.message });
  } finally {
    session.endSession();
    // Release Lock
    await redisClient.del(lockKey);
  }
};

/**
 * Background Task: Expire pending bookings
 * Runs every 2 minutes
 */
export const cleanupExpiredBookings = async () => {
  const bufferTime = 10 * 60 * 1000; 
  const expiryThreshold = new Date(Date.now() - bufferTime);

  try {
    const result = await Booking.updateMany(
      { 
        status: "pending", 
        createdAt: { $lt: expiryThreshold } 
      },
      { 
        $set: { status: "expired", paymentStatus: "failed" } 
      }
    );
    if (result.modifiedCount > 0) {
      console.log(`Cleaned up ${result.modifiedCount} expired pending bookings.`);
    }
  } catch (err) {
    console.error("Cleanup Error:", err);
  }
};

// Schedule cleanup
cron.schedule("*/2 * * * *", cleanupExpiredBookings);

// Legacy/Required Export for Route
export const getAvailableCars = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default search for currently "active" cars
    let query = { status: "active" };
    
    const cars = await Car.find(query);
    
    // If dates provided, filter dynamically
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      
      const filtered = [];
      for (const car of cars) {
        const available = await checkCarAvailability(car._id, s, e);
        if (available) filtered.push(car);
      }
      return res.json(filtered);
    }

    res.json(cars);
  } catch (error) {
    console.error("Error fetching available cars:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify Booking Status (GET /api/booking/status/:id)
export const verifyBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ status: booking.status, paymentStatus: booking.paymentStatus });
  } catch (error) {
    console.error("Error verifying booking status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Manual Payment Verification (Bypasses Webhooks for Localhost)
export const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // If already confirmed, just return status
    if (booking.status === "confirmed" && booking.paymentStatus === "paid") {
      return res.status(200).json({ 
        status: booking.status, 
        paymentStatus: booking.paymentStatus,
        message: "Booking already confirmed" 
      });
    }
    
    // If pending and has a session ID, verify with Stripe
    if (booking.stripeSessionId) {
      const session = await stripe.checkout.sessions.retrieve(booking.stripeSessionId);
      
      if (session.payment_status === "paid") {
        // Update booking
        booking.status = "confirmed";
        booking.paymentStatus = "paid";
        booking.transactionId = session.payment_intent;
        await booking.save();
        
        // Invalidate Cache for Car Listings
        const keys = await redisClient.keys("cars_query_*");
        if (keys.length > 0) await redisClient.del(...keys);

        // Invalidate User and Owner caches
        if (booking.user) {
          const uKeys = await redisClient.keys(`user_bookings_${booking.user.toString()}_*`);
          if (uKeys.length > 0) await redisClient.del(...uKeys);
        }
        if (booking.car && booking.car.ownerId) {
          const oId = booking.car.ownerId.toString();
          const oKeys = await redisClient.keys(`owner_bookings_${oId}_*`);
          const rKeys = await redisClient.keys(`owner_recent_bookings_${oId}`);
          if (oKeys.length > 0) await redisClient.del(...oKeys);
          if (rKeys.length > 0) await redisClient.del(...rKeys);
        }

        console.log(`Booking ${id} manually verified and confirmed.`);
        
        return res.status(200).json({ 
          status: "confirmed", 
          paymentStatus: "paid",
          message: "Payment verified successfully" 
        });
      }
    }

    // Default return if not paid or no session
    res.status(200).json({ 
      status: booking.status, 
      paymentStatus: booking.paymentStatus,
      message: "Payment pending or verification failed"
    });

  } catch (error) {
    console.error("Manual verification error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

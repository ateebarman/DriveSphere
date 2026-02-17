import { User } from "../models/UserModel.js";
import { Car } from "../models/carModel.js";
import { Booking } from "../models/bookingModel.js";
import bcrypt from "bcryptjs";
import { redisClient } from "../app.js";

//GET THE USER PROFILE :
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//UPDATE USER PROFILE
// export const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const { fullname } = req.body;

//     // if (email && email !== user.email) {
//     //   const isExist = await User.findOne({ email });
//     //   if (isExist) {
//     //     res.status(400).json({ message: "email already in Use" });
//     //   }
//     //   user.email = email;
//     // }

//     //what else to change
//     if (fullname) {
//       user.fullname = fullname;
//     }

//     const updatedUser = await user.save(); //saving updated info to DB
//     res.json({
//       //sending new updated data as response
//       id: updatedUser._id,
//       fullname: updatedUser.fullname,
//       // email: updatedUser.email,
//       // role: updatedUser.role,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

export const updateUserProfile = async (req, res) => {
  try {
    const ownerId = req.user.id; // Get the logged-in user's ID
    const { fullname } = req.body;

    // Validate the new name
    if (!fullname || fullname.trim() === "") {
      return res.status(400).json({ message: "Name is required." });
    }

    // Find the user and update the name
    const updatedUser = await User.findByIdAndUpdate(
      ownerId,
      { fullname },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating profile." });
  }
};

export const UserBookingDetails = async (req, res) => {
  try {
    const user = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `user_bookings_${user}_p${page}_l${limit}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json(typeof cached === 'string' ? JSON.parse(cached) : cached);
      }
    } catch (err) {
      console.error("Redis Error:", err);
    }

    const totalBookings = await Booking.countDocuments({ user });
    const bookings = await Booking.find({ user })
      .populate("car")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const result = {
      message: "Bookings retrieved successfully",
      bookings,
      totalBookings,
      totalPages: Math.ceil(totalBookings / (limit || 10)),
      currentPage: page
    };

    if (bookings && bookings.length > 0) {
      try {
        await redisClient.set(cacheKey, JSON.stringify(result), { ex: 300 }); // 5 min cache
      } catch (err) {
        console.error("Redis SET Error:", err);
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteuserbooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by ID
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // After deleting the booking, update the car's status to 'available'
    const carId = deletedBooking.car; // Assuming 'car' is a reference to the car's ID in the Booking schema
    const car = await Car.findByIdAndUpdate(carId, { status: "available" });

    // Invalidate Cache for User and Owner
    const userKeys = await redisClient.keys(`user_bookings_${req.user.id}_*`);
    if (userKeys.length > 0) await redisClient.del(...userKeys);

    if (car && car.ownerId) {
      const ownerKeys = await redisClient.keys(`owner_bookings_${car.ownerId.toString()}_*`);
      const recentKeys = await redisClient.keys(`owner_recent_bookings_${car.ownerId.toString()}`);
      if (ownerKeys.length > 0) await redisClient.del(...ownerKeys);
      if (recentKeys.length > 0) await redisClient.del(...recentKeys);
    }

    res
      .status(200)
      .json({ message: "Booking deleted and car marked as available." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Unable to delete booking." });
  }
};

//UPDATE USER PASSWORD
export const updatePassword = async (req, res) => {
  const { currPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE USER ACCOUNT
export const deleteUserAccount = async (req, res) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all bookings associated with the user
    await Booking.deleteMany({ user: req.user.id });

    // Delete the user account
    await User.findByIdAndDelete(req.user.id);

    res.json({
      message: "User account and associated bookings deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      location, 
      brand, 
      type, 
      transmission, 
      fuelType 
    } = req.query;

    const p = parseInt(page);
    const l = parseInt(limit);
    const skip = (p - 1) * l;

    // Build query object
    const query = { status: "active" };
    if (location) query.currentLocation = location;
    if (brand) query.brand = { $in: brand.split(",") };
    if (type) query.type = { $in: type.split(",") };
    if (transmission) query.transmission = { $in: transmission.split(",") };
    if (fuelType) query.fuelType = { $in: fuelType.split(",") };

    // Dynamic Availability Filtering
    const { startDate, endDate } = req.query;
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const bufferTime = 10 * 60 * 1000;
      const now = new Date();

      // Find bookings that overlap with requested dates
      const bookedCars = await Booking.find({
        $or: [
          { status: "confirmed" },
          { 
            status: "pending", 
            createdAt: { $gte: new Date(now.getTime() - bufferTime) } 
          }
        ],
        rentalStartDate: { $lt: e },
        rentalEndDate: { $gt: s }
      }).select("car");

      const bookedCarIds = bookedCars.map(b => b.car);
      if (bookedCarIds.length > 0) {
        query._id = { $nin: bookedCarIds };
      }
    }

    const cacheKey = `cars_query_${JSON.stringify(query)}_p${p}_l${l}_s${startDate || 'none'}_e${endDate || 'none'}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json(typeof cached === 'string' ? JSON.parse(cached) : cached);
      }
    } catch (err) {
      console.error("Redis error:", err);
    }

    const totalCars = await Car.countDocuments(query);
    const cars = await Car.find(query)
      .skip(skip)
      .limit(l)
      .sort({ createdAt: -1 });

    const result = {
      cars,
      totalCars,
      totalPages: Math.ceil(totalCars / l),
      currentPage: p
    };

    try {
      await redisClient.set(cacheKey, JSON.stringify(result), { ex: 30 }); // Shorter cache for dynamic filters
    } catch (err) {
      console.error("Redis SET error:", err);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const cancelBooking = async (req, res) => {
//   const { id } = req.params; // Get booking ID from params

//   try {
//       // Find the booking by ID
//       const booking = await Booking.findById(id);
//       console.log(id);

//       if (!booking) {
//           return res.status(404).json({ message: "Booking not found" });
//       }

//       // Check if the booking is already canceled
//       if (booking.status === "canceled") {
//           return res.status(400).json({ message: "Booking is already canceled" });
//       }

//       // Update the status of the booking to "canceled"
//       booking.status = "canceled";
//       await booking.save();

//       return res.status(200).json({
//           message: "Booking canceled successfully",
//           booking,
//       });
//   } catch (error) {
//       console.error("Error canceling booking:", error);
//       return res.status(500).json({
//           message: "Internal server error while canceling the booking",
//       });
//   }
// };

export const cancelBooking = async (req, res) => {
  const { id } = req.params; // Get booking ID from params

  try {
    // Find the booking by ID
    const booking = await Booking.findById(id).populate("car"); 
    console.log(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure the booking belongs to the logged-in user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to cancel this booking" });
    }

    // Check if the booking is already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Update the status of the booking to "cancelled"
    booking.status = "cancelled";
    await booking.save();

    // Invalidate Cache
    const carKeys = await redisClient.keys("cars_query_*");
    const userKeys = await redisClient.keys(`user_bookings_${req.user.id}_*`);
    if (carKeys.length > 0) await redisClient.del(...carKeys);
    if (userKeys.length > 0) await redisClient.del(...userKeys);

    if (booking.car && booking.car.ownerId) {
      const ownerIdStr = booking.car.ownerId.toString();
      const ownerKeys = await redisClient.keys(`owner_bookings_${ownerIdStr}_*`);
      const recentKeys = await redisClient.keys(`owner_recent_bookings_${ownerIdStr}`);
      if (ownerKeys.length > 0) await redisClient.del(...ownerKeys);
      if (recentKeys.length > 0) await redisClient.del(...recentKeys);
    }

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error canceling booking:", error);
    return res.status(500).json({
      message: "Internal server error while canceling the booking",
    });
  }
};

//View Booking History (GET /api/users/:id/bookings)

//Make a New Booking (POST /api/bookings)

//Cancel Booking (DELETE /api/bookings/:bookingId)

//Forgot Password (POST /api/users/forgot-password)

//Reset Password (PUT /api/users/reset-password/:token)
// Enables the consumer to reset their password using the token sent to their email after the "forgot password" request.

//Leave a Review (POST /api/cars/:carId/reviews)

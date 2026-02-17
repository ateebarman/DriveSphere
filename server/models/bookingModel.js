import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  regNumber: {
    type: String,
    required: true,
  },
  rentalStartDate: {
    type: Date,
    required: true,
  },
  rentalEndDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true
  },
  priceSnapshot: {
    type: Number, // The daily rate at the time of booking
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "expired", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "cash"],
    required: true,
  },
  transactionId: {
    type: String,
    required: function() {
      return this.paymentStatus === "paid";
    },
  },
  stripeSessionId: {
    type: String, // Store Stripe Session ID for manual verification
  },
  rentalLocation: {
    pickupLocation: {
      type: String,
      required: true,
    },
    dropoffLocation: {
      type: String,
      required: true,
    }
  },
}, { timestamps: true });

// Optimizing queries with proper MongoDB indexing for vehicleId and booking dates
bookingSchema.index({ car: 1, rentalStartDate: 1, rentalEndDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ user: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
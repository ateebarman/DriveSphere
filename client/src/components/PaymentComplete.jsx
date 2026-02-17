import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { API_END_POINT_booking } from "../utils/constants";
import { motion } from "framer-motion";
import { HiCheckCircle, HiOutlineClock, HiOutlineLocationMarker, HiArrowRight, HiExclamationCircle } from "react-icons/hi";
import toast from "react-hot-toast";

const PaymentComplete = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  // We can still use local storage for display data if needed, but the booking is already created
  const formData = JSON.parse(localStorage.getItem("formData"));

  const [bookingStatus, setBookingStatus] = useState({
    isCompleted: false,
    message: "Verifying payment...",
    details: null
  });

  useEffect(() => {
    if (!bookingId) {
      setBookingStatus({
        isCompleted: false,
        message: "No booking ID found. Please contact support."
      });
      return;
    }

    let attempts = 0;
    const maxAttempts = 10; // 20 seconds total

    // Polling function to check status
    // Polling function to check status using verify endpoint
    const intervalId = setInterval(async () => {
      try {
        attempts++;
        // Use the verify endpoint which checks Stripe directly
        const response = await axios.get(`${API_END_POINT_booking}/verify/${bookingId}`);
        const { status, paymentStatus } = response.data;

        if (response.data.status === "confirmed" && response.data.paymentStatus === "paid") {
          clearInterval(intervalId);
          setBookingStatus({
            isCompleted: true,
            message: "Reservation Confirmed!",
            details: response.data
          });
          toast.success("Booking confirmed!");
        } else if (status === "expired" || paymentStatus === "failed") {
          clearInterval(intervalId);
          setBookingStatus({
            isCompleted: false,
            message: "Payment failed or session expired."
          });
          toast.error("Payment failed.");
        } else if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          setBookingStatus(prev => ({
            ...prev,
            message: "Payment verification timed out. Please check your dashboard."
          }));
          toast.error("Verification timed out.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        if (attempts >= maxAttempts) clearInterval(intervalId);
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(intervalId);
  }, [bookingId]);

  if (!formData && !bookingStatus.isCompleted) {
    // Fallback if local storage is cleared but we have a booking ID
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 text-center max-w-md">
          <h1 className="text-xl font-bold text-white mb-4">{bookingStatus.message}</h1>
          <button onClick={() => navigate('/')} className="premium-button">Return Home</button>
        </div>
      </div>
    )
  }

  // Calculate duration for display (either from local storage or eventually from fetched booking details)
  const duration = formData ? (new Date(formData.rentalEndDate) - new Date(formData.rentalStartDate)) / (1000 * 60 * 60 * 24) : 0;
  const totalPrice = formData ? formData.totalPrice : 0;

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 rounded-[3rem] border border-white/10 shadow-premium max-w-2xl w-full text-center"
      >
        {bookingStatus.isCompleted ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <HiCheckCircle size={64} className="text-green-500" />
            </motion.div>

            <h1 className="text-4xl font-display font-extrabold text-white mb-4 tracking-tight">
              {bookingStatus.message}
            </h1>
            <p className="text-surface-400 mb-10 italic">
              "Get ready for your journey. Your premium ride is waiting."
            </p>

            {formData && (
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
                  <div className="flex items-center gap-2 text-primary-400 mb-1">
                    <HiOutlineClock />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Duration</span>
                  </div>
                  <p className="text-white font-bold">{duration.toFixed(1)} Days</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
                  <div className="flex items-center gap-2 text-accent-400 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Total Paid</span>
                  </div>
                  <p className="text-white font-bold">₹{Math.floor(totalPrice * duration)}</p>
                </div>
                <div className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
                  <div className="flex items-center gap-2 text-surface-500 mb-1">
                    <HiOutlineLocationMarker />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Pickup Point</span>
                  </div>
                  <p className="text-white font-semibold">{formData.rentalLocation.pickupLocation}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate("/userdash")}
              className="premium-button w-full py-4 text-lg font-bold flex items-center justify-center gap-2 group"
            >
              Go to Dashboard
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        ) : (
          <div className="space-y-6 py-10">
            {bookingStatus.message.includes("failed") || bookingStatus.message.includes("timed out") ? (
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiExclamationCircle size={40} className="text-red-500" />
              </div>
            ) : (
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            )}

            <h1 className="text-2xl font-display font-bold text-white">
              {bookingStatus.message}
            </h1>

            {(bookingStatus.message.includes("failed") || bookingStatus.message.includes("timed out")) && (
              <button onClick={() => navigate('/allcars')} className="premium-button mt-4">Try Again</button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentComplete;

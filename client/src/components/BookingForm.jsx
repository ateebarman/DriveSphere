import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { setFormData } from "../redux/bookingSlice";
import CarImageSlider from "./CarImageSlider";
import { API_END_POINT_checkout, API_END_POINT_booking } from "../utils/constants";
import { motion } from "framer-motion";
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineCreditCard, HiCheckCircle } from "react-icons/hi";
import toast from "react-hot-toast";

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { car } = location.state || {};

  const StartDate = useSelector((state) => state.car.startDate);
  const DropDate = useSelector((state) => state.car.dropDate);

  const [formData, setLocalFormData] = useState({
    regNumber: car?.regNumber || '',
    rentalStartDate: StartDate || '',
    rentalEndDate: DropDate || '',
    totalPrice: car?.rentalPricePerDay || 0,
    paymentStatus: 'pending',
    paymentMethod: 'credit_card',
    transactionId: '',
    rentalLocation: {
      pickupLocation: '',
      dropoffLocation: ''
    },
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocationChange = (e, field) => {
    const { value } = e.target;
    setLocalFormData((prevData) => {
      const updatedData = {
        ...prevData,
        rentalLocation: {
          ...prevData.rentalLocation,
          [field]: value,
        },
      };
      localStorage.setItem("formData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const durationFunc = (start, end) => {
    const diffInMs = new Date(end) - new Date(start);
    return Math.max(0, diffInMs / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    let toastId;

    try {
      toastId = toast.loading("Securing your reservation...");

      // 1. Create Pending Booking (Reserve the slot)
      const bookingResponse = await axios.post(
        `${API_END_POINT_booking}/booked`,
        formData,
        { withCredentials: true }
      );

      const bookingId = bookingResponse.data.booking._id;
      toast.success("Vehicle reserved! Redirecting to payment...", { id: toastId });

      // 2. Initiate Payment with Booking ID
      const duration = durationFunc(formData.rentalStartDate, formData.rentalEndDate);
      const totalPrice = formData.totalPrice * duration;

      const checkoutResponse = await axios.post(`${API_END_POINT_checkout}/checkout`, {
        carName: car?.model,
        totalPrice: totalPrice,
        bookingId: bookingId
      }, {
        withCredentials: true,
      });

      window.location.href = checkoutResponse.data.url;

    } catch (error) {
      console.error("Booking/Payment Error:", error);

      const status = error.response?.status;
      let message = "Booking failed.";

      if (status === 409) message = "This vehicle is already booked for these dates.";
      if (status === 423) message = "Vehicle is currently locked by another user. Please try again in top 30 seconds.";

      toast.error(error.response?.data?.message || message, { id: toastId });
      setIsProcessing(false);
    }
  };

  if (!car) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">No car selected</h2>
        <button onClick={() => navigate('/')} className="premium-button">Go Back Home</button>
      </div>
    </div>
  );

  const duration = durationFunc(formData.rentalStartDate, formData.rentalEndDate);

  return (
    <div className="min-h-full bg-surface-950 pb-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* Car Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="glass-card p-2 rounded-[2.5rem] overflow-hidden border border-white/5">
            <CarImageSlider car={car} height="500px" />
          </div>

          <div className="glass-card p-8 rounded-[2rem] border border-white/5">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-4xl font-display font-extrabold text-white mb-2">{car.brand} {car.model}</h2>
                <span className="px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-bold uppercase tracking-widest">{car.type}</span>
              </div>
              <div className="text-right">
                <p className="text-surface-500 text-sm uppercase font-bold tracking-widest">Pricing</p>
                <h3 className="text-3xl font-display font-bold text-white">₹{car.rentalPricePerDay}<span className="text-sm text-surface-400 font-normal">/day</span></h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Transmission', value: car.transmission },
                { label: 'Fuel Type', value: car.fuelType },
                { label: 'Seats', value: `${car.seats} Seater` },
                { label: 'Mileage', value: `${car.mileage}km/L` }
              ].map((spec, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                  <p className="text-[10px] uppercase font-bold text-surface-500 tracking-wider mb-1">{spec.label}</p>
                  <p className="text-sm font-semibold text-white">{spec.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">Description</h4>
              <p className="text-surface-400 leading-relaxed italic">"{car.description}"</p>
            </div>
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5"
        >
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 shadow-premium sticky top-32">
            <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
              <HiOutlineCreditCard className="text-primary-500" />
              Complete Booking
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 ml-1">
                    <HiOutlineCalendar className="text-primary-400" />
                    Pickup Date
                  </label>
                  <input
                    type="datetime-local"
                    name="rentalStartDate"
                    value={formData.rentalStartDate}
                    onChange={handleChange}
                    className="premium-input text-xs"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 ml-1">
                    <HiOutlineCalendar className="text-primary-400" />
                    Return Date
                  </label>
                  <input
                    type="datetime-local"
                    name="rentalEndDate"
                    value={formData.rentalEndDate}
                    onChange={handleChange}
                    className="premium-input text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 ml-1">
                  <HiOutlineLocationMarker className="text-primary-400" />
                  Pickup Point
                </label>
                <input
                  type="text"
                  value={formData.rentalLocation.pickupLocation}
                  onChange={(e) => handleLocationChange(e, "pickupLocation")}
                  className="premium-input"
                  placeholder="e.g., Terminal 3, Airport"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 ml-1">
                  <HiOutlineLocationMarker className="text-primary-400" />
                  Return Point
                </label>
                <input
                  type="text"
                  value={formData.rentalLocation.dropoffLocation}
                  onChange={(e) => handleLocationChange(e, "dropoffLocation")}
                  className="premium-input"
                  placeholder="e.g., Downtown Branch"
                  required
                />
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-surface-400">
                  <span>Rental duration</span>
                  <span className="font-bold text-white">{duration.toFixed(1)} Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total Amount</span>
                  <span className="text-2xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                    ₹{Math.floor(formData.totalPrice * duration)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="premium-button w-full py-4 text-lg font-bold shadow-primary-500/25 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <HiCheckCircle size={24} />
                    Confirm & Pay
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[10px] text-surface-500 mt-6 uppercase tracking-widest font-bold">
              Secure payment via Stripe
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingForm;

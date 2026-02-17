import React, { useState, useEffect } from "react";
import { API_END_POINT_CarOwner } from "../../utils/constants";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineCurrencyRupee, HiOutlineTrash, HiOutlineHand, HiOutlineTruck, HiOutlineInbox, HiOutlineClock } from "react-icons/hi";
import Pagination from "../Common/Pagination";
import Skeleton from "../Common/Skeleton";

const OwnerBookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_END_POINT_CarOwner}/CarOwnerBookingDetails?page=${page}&limit=10`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      toast.error("Telemetry failure: Unable to retrieve mission data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteBooking = async (bookingId) => {
    try {
      await axios.delete(`${API_END_POINT_CarOwner}/deletecarownerbooking/${bookingId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      toast.success("Mission data purged.");
    } catch (err) {
      toast.error("Purge failure.");
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.patch(`${API_END_POINT_CarOwner}/canceluserbooking/${bookingId}`, {
        status: "cancelled",
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setBookings(bookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
      ));
      toast.success("Mission aborted.");
    } catch (err) {
      toast.error("Abort sequence failed.");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase">Mission Requests</h2>
          <p className="text-surface-500 mt-2 font-medium italic">Incoming deployment requests and active contracts.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-surface-900/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col h-96">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4 flex-1">
                  <Skeleton className="w-14 h-14 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-4 mb-8">
                <Skeleton className="h-14 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="mt-auto flex gap-4">
                <Skeleton className="h-14 flex-1 rounded-2xl" />
                <Skeleton className="h-14 w-16 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
          <AnimatePresence mode="popLayout">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(i * 0.05, 0.3), // Cap the delay for long lists
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="group relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 hover:border-white/10 transition-all duration-500 shadow-premium will-change-transform"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary-400 border border-white/5 group-hover:scale-110 transition-transform">
                      <HiOutlineTruck size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">
                        {booking.car.brand} <span className="text-primary-400">{booking.car.model}</span>
                      </h3>
                      <p className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]">{booking.car.regNumber}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    booking.status === 'canceled' || booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-primary-500/10 text-primary-400 border-primary-500/20'
                    }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    <HiOutlineLocationMarker className="text-surface-500" size={20} />
                    <div>
                      <p className="text-[8px] font-black text-surface-500 uppercase tracking-widest">Route Analysis</p>
                      <p className="text-xs font-bold text-white uppercase">{booking.rentalLocation.pickupLocation} → {booking.rentalLocation.dropoffLocation}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                      <HiOutlineCalendar className="text-surface-500 mb-2" size={18} />
                      <p className="text-[8px] font-black text-surface-500 uppercase tracking-widest">Duration</p>
                      <p className="text-xs font-bold text-white uppercase">
                        {new Date(booking.rentalStartDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                      <HiOutlineCurrencyRupee className="text-emerald-500 mb-2" size={18} />
                      <p className="text-[8px] font-black text-surface-500 uppercase tracking-widest">Contract Value</p>
                      <p className="text-sm font-black text-white uppercase">₹{booking.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-surface-500 mb-1">
                      <HiOutlineClock size={14} />
                      <p className="text-[8px] font-black uppercase tracking-widest">Booked On</p>
                    </div>
                    <p className="text-xs font-bold text-white uppercase">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-surface-600 mt-0.5">
                      {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-surface-500 uppercase tracking-widest">Personnel Assigned</p>
                    <p className="text-xs font-bold text-white mt-1 uppercase">{booking.user?.fullname}</p>
                    <p className="text-[10px] text-surface-600 truncate">{booking.user?.email}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {booking.status !== 'cancelled' && booking.status !== 'canceled' && booking.status !== 'completed' && new Date(booking.rentalStartDate) > new Date() && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    >
                      <HiOutlineHand size={18} />
                      Abort Mission
                    </button>
                  )}
                  <button
                    onClick={() => deleteBooking(booking._id)}
                    className="w-16 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-2xl transition-all flex items-center justify-center"
                  >
                    <HiOutlineTrash size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {bookings.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-surface-600 mb-8 border border-white/10">
                <HiOutlineInbox size={40} />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest">Zero Requests Detect</h3>
              <p className="text-surface-500 mt-2 font-light max-w-xs mx-auto">No incoming mission requests detected in your current sector.</p>
            </div>
          )}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default OwnerBookingDetails;

import React, { useState, useEffect } from "react";
import { API_END_POINT } from "../../utils/constants";
import toast from "react-hot-toast";
import axios from "axios";
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineTrash, HiOutlineXCircle, HiOutlineCubeTransparent, HiOutlineClock } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "../Common/Pagination";
import Skeleton from "../Common/Skeleton";

const UserBookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_END_POINT}/userbookingdetails?page=${page}&limit=6`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setBookings(response.data.bookings || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Fleet intelligence retrieval failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const deleteBooking = async (bookingId) => {
    try {
      await axios.delete(`${API_END_POINT}/deleteuserbooking/${bookingId}`, {
        withCredentials: true,
      });
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      toast.success("Mission records scrubbed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Purge sequence failed");
    }
  };

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("ABORT MISSION: Are you sure you want to cancel this deployment?");
    if (!confirmCancel) return;

    try {
      await axios.patch(`${API_END_POINT}/canceluserbooking/${bookingId}`,
        { status: "cancelled" },
        { withCredentials: true }
      );
      setBookings(bookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
      ));
      toast.success("Mission aborted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Abort sequence failure");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase">Operational History</h2>
          <p className="text-surface-500 mt-2 font-medium italic">Track your active deployments and historical fleet usage.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Global Registry Active</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-surface-900/50 border border-white/5 rounded-[3rem] p-8 flex flex-col h-80">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                <Skeleton className="h-10 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(i * 0.04, 0.2),
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="group relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 hover:border-white/10 transition-all duration-500 shadow-premium overflow-hidden will-change-transform"
              >
                {/* Status Badge */}
                <div className="absolute top-8 right-8">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${booking.status === 'canceled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    booking.status === 'booked' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors">
                      {booking.car?.brand} <span className="text-surface-500">{booking.car?.model}</span>
                    </h3>
                    <p className="text-[10px] font-black text-surface-600 uppercase tracking-[0.3em] mt-1">{booking.car?.regNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <HiOutlineCalendar className="text-primary-500 mt-1" size={18} />
                        <div>
                          <p className="text-[8px] font-black text-surface-500 uppercase tracking-widest leading-none mb-1">Deployment Period</p>
                          <p className="text-xs font-bold text-white">
                            {new Date(booking.rentalStartDate).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-surface-400 mt-0.5">to {new Date(booking.rentalEndDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 mt-4">
                        <HiOutlineClock className="text-surface-500 mt-1" size={18} />
                        <div>
                          <p className="text-[8px] font-black text-surface-500 uppercase tracking-widest leading-none mb-1">Booked On</p>
                          <p className="text-xs font-bold text-white">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-surface-400 mt-0.5">
                            {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <HiOutlineLocationMarker className="text-accent-500 mt-1" size={18} />
                        <div>
                          <p className="text-[8px] font-black text-surface-500 uppercase tracking-widest leading-none mb-1">Extraction Point</p>
                          <p className="text-xs font-bold text-white truncate max-w-[150px]">{booking.rentalLocation?.pickupLocation}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">Contract Value</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[10px] font-black text-emerald-500 uppercase">₹</span>
                        <span className="text-2xl font-display font-black text-white tracking-tighter">{booking.totalPrice?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {booking.status !== "canceled" && booking.status !== "cancelled" && new Date(booking.rentalStartDate) > new Date() && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="p-3 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white border border-orange-500/20 transition-all"
                          title="Abort Deployment"
                        >
                          <HiOutlineXCircle size={18} />
                        </button>
                      )}

                      <button
                        onClick={() => deleteBooking(booking._id)}
                        className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all"
                        title="Scrub Records"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center glass-card rounded-[3rem] border-white/5 p-16">
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
            <HiOutlineCubeTransparent size={48} className="text-surface-600" />
          </div>
          <h3 className="text-2xl font-display font-black text-white mb-4 uppercase tracking-tight">Zero Active Missions</h3>
          <p className="text-surface-500 max-w-sm font-medium italic">Your operational history is currently clear. Onboard a vehicle to begin tracking deployments.</p>
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

export default UserBookingDetails;

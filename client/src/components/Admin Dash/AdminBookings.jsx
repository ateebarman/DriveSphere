import React, { useState, useEffect } from "react";
import { API_END_POINT_admin, API_END_POINT_CarOwner } from "../../utils/constants";
import { API_END_POINT } from "../../utils/constants";
import toast from "react-hot-toast";
import axios from "axios";
import Pagination from "../Common/Pagination";
import Skeleton from "../Common/Skeleton";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = async (page = 1, search = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_END_POINT_admin}/allbookings?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Unable to fetch bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBookings(currentPage, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Function to delete a booking
  const deleteBooking = async (bookingId) => {
    setMessage("");
    try {
      await axios.delete(
        `${API_END_POINT_CarOwner}/deletecarownerbooking/${bookingId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      toast.success("Booking deleted successfully.");
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Unable to delete booking"
      );
    }
  };

  // Function to cancel a booking
  const cancelBooking = async (bookingId) => {
    setMessage('');
    try {
      await axios.patch(`${API_END_POINT_CarOwner}/canceluserbooking/${bookingId}`, {
        status: "cancelled", // Send the status update
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // to send cookies or session info
      });
      // Update the booking status in the state
      setBookings(bookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
      ));
      toast.success("Booking canceled successfully.");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Unable to cancel booking");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">Booking Master Ledger</h2>
          <p className="text-surface-500 mt-1 font-medium">Verify and manage all active rental agreements and transaction statuses.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-2xl" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Filter bookings by location or status..."
          className="relative w-full p-4 pl-6 rounded-2xl bg-surface-900/50 border border-white/10 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 transition-all backdrop-blur-xl shadow-inner"
        />
      </div>

      {/* Booking Table */}
      <div className="bg-surface-900/50 rounded-[2.5rem] border border-white/5 shadow-premium overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] uppercase font-black tracking-[0.2em] text-surface-500 border-b border-white/5">
                <th className="px-8 py-6">Asset & ID</th>
                <th className="px-8 py-6">Stakeholder</th>
                <th className="px-8 py-6">Timeline</th>
                <th className="px-8 py-6">Booked On</th>
                <th className="px-8 py-6">Financials</th>
                <th className="px-8 py-6">Logistics</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-center">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <Skeleton className="h-8 w-20 rounded-lg mx-auto" />
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center text-primary-400">
                          <span className="text-xs font-black">CD</span>
                        </div>
                        <div>
                          <p className="text-white text-xs font-bold uppercase tracking-wider">{booking.car.brand} {booking.car.model}</p>
                          <p className="text-[10px] text-surface-600 font-mono font-bold tracking-tighter uppercase">{booking.car.regNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <p className="text-white text-xs font-bold uppercase tracking-tight">{booking.user?.fullname}</p>
                        <p className="text-[10px] text-surface-500 font-medium">{booking.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5 text-surface-300 font-bold">
                          {new Date(booking.rentalStartDate).toLocaleDateString()}
                        </span>
                        <span className="text-surface-700">→</span>
                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5 text-surface-300 font-bold">
                          {new Date(booking.rentalEndDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <p className="text-white text-xs font-bold uppercase tracking-tight">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-surface-500 font-medium">
                          {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-white font-black text-sm">₹{booking.totalPrice}</p>
                      <p className="text-[9px] text-surface-600 uppercase tracking-widest font-black">Gross Revenue</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-[10px] text-surface-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary-500" /> {booking.rentalLocation.pickupLocation}</p>
                        <p className="text-[10px] text-surface-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent-500" /> {booking.rentalLocation.dropoffLocation}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <StatusPill status={booking.status} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => deleteBooking(booking._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-premium"
                          title="Delete Record"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        {booking.status !== "canceled" && booking.status !== "cancelled" && new Date(booking.rentalStartDate) > new Date() && (
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500 hover:text-white transition-all shadow-premium"
                            title="Cancel Reservation"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-20">
                    <p className="text-surface-600 font-bold uppercase tracking-widest text-xs">No active bookings detected</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div >

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div >
  );
};

const StatusPill = ({ status }) => {
  const styles = {
    Completed: "bg-green-500/10 text-green-400 border-green-500/20",
    canceled: "bg-red-500/10 text-red-400 border-red-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    default: "bg-primary-500/10 text-primary-400 border-primary-500/20"
  };

  const currentStyle = styles[status] || styles.default;

  return (
    <span className={`inline-block px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border ${currentStyle} backdrop-blur-md`}>
      {status}
    </span>
  );
};

export default AdminBookings;

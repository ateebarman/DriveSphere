import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaUsers, FaCar, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import Chart from "./Chart";
import Graph from "./Graph";
import { CgProfile } from "react-icons/cg";
import { API_END_POINT_admin, API_END_POINT_CarOwner } from "../../utils/constants";
// import '../styles/AdminReport.css'

const AdminReport = () => {
  const userRole = useSelector((state) => state.app.user?.role);
  const [cars, setCars] = useState([]);
  const [ownedCars, setOwnedCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [carOwnerBookings, setCarOwnerBookings] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
  const [carOwnerRevenue, setCarOwnerRevenue] = useState(0);
  const [lastMonthCarOwnerRevenue, setLastMonthCarOwnerRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userRole === "admin") {
          await Promise.all([getCars(), getUsers(), getBookings()]);
        } else if (userRole === "carOwner") {
          await Promise.all([getOwnedCars(), getCarOwnerBookings()]);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchRecentBookings();
  }, [userRole]);

  const getCars = async () => {
    try {
      const res = await axios.get(
        `${API_END_POINT_admin}/getallcars?limit=all`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setCars(res.data.cars);
    } catch (error) {
      console.error("Error fetching cars:", error.message);
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get(
        `${API_END_POINT_admin}/getallusers?limit=all`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const getBookings = async () => {
    try {
      const res = await axios.get(
        `${API_END_POINT_admin}/allbookings?limit=all`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setBookings(res.data.bookings);
      calculateRevenue(res.data.bookings, setRevenue, setLastMonthRevenue);
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
    }
  };

  const getOwnedCars = async () => {
    try {
      const res = await axios.get(
        `${API_END_POINT_CarOwner}/getallownedcars`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log(res)
      setOwnedCars(res.data.cars);
    } catch (error) {
      console.error("Error fetching owned cars:", error.message);
    }
  };

  const getCarOwnerBookings = async () => {
    try {
      const res = await axios.get(
        `${API_END_POINT_CarOwner}/CarOwnerBookingDetails`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log(res)
      setCarOwnerBookings(res.data.bookings);
      calculateRevenue(
        res.data.bookings,
        setCarOwnerRevenue,
        setLastMonthCarOwnerRevenue
      );
    } catch (error) {
      console.error("Error fetching car owner bookings:", error.message);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      let res;
      if (userRole === "admin") {
        res = await axios.get(
          `${API_END_POINT_admin}/recent-bookings`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } else if (userRole === "carOwner") {
        res = await axios.get(
          `${API_END_POINT_CarOwner}/recent-bookings`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      }

      if (res && res.data) {
        console.log("Fetched recent bookings:", res.data); // Log response data directly
        setRecentBookings(res.data); // Update state with fetched data
      }
    } catch (error) {
      console.error("Error fetching recent bookings:", error.message);
    }
  };

  // const calculateRevenue = (bookings, setTotalRevenue, setLastMonthRevenue) => {
  //   const currentDate = new Date();
  //   const lastMonth = currentDate.getMonth() - 1;
  //   const totalRevenue = bookings.reduce((total, booking) => total + booking.totalPrice, 0);
  //   const lastMonthRevenue = bookings
  //     .filter((booking) => new Date(booking.date).getMonth() === lastMonth)
  //     .reduce((total, booking) => total + booking.totalPrice, 0);

  //   setTotalRevenue(totalRevenue);
  //   setLastMonthRevenue(lastMonthRevenue);
  // };

  const calculateRevenue = (bookings, setTotalRevenue, setLastMonthRevenue) => {
    const currentDate = new Date();
    const lastMonth = currentDate.getMonth() - 1;

    // Filter out canceled bookings
    const validBookings = bookings.filter(
      (booking) => booking.status !== "canceled"
    );

    // Calculate total revenue from valid bookings
    let totalRevenue = 0;
    if (userRole === "admin") {
      totalRevenue = validBookings.reduce(
        (total, booking) => total + booking.totalPrice * 0.2,
        0
      );
    } else if (userRole === "carOwner") {
      totalRevenue = validBookings.reduce(
        (total, booking) => total + booking.totalPrice * 0.8,
        0
      );
    }

    // Calculate revenue for the last month from valid bookings
    const lastMonthRevenue = validBookings
      .filter((booking) => new Date(booking.date).getMonth() === lastMonth)
      .reduce((total, booking) => total + booking.totalPrice, 0);

    setTotalRevenue(totalRevenue);
    setLastMonthRevenue(lastMonthRevenue);
  };

  return (
    <div className="min-h-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight">
            {userRole === "admin" ? "Systems Overview" : "Fleet Performance"}
          </h1>
          <p className="text-surface-500 mt-1 font-medium italic">
            Monitor your platform's real-time statistics and activities.
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Live Status</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-surface-500 font-bold uppercase tracking-widest text-xs">Synchronizing Data...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRole === "admin" && (
              <StatCard
                title="Total Users"
                value={users.length}
                icon={FaUsers}
                color="from-red-500/20 to-red-500/5"
                accent="text-red-400"
              />
            )}
            <StatCard
              title="Total Cars"
              value={userRole === "admin" ? cars.length : ownedCars.length}
              icon={FaCar}
              color="from-blue-500/20 to-blue-500/5"
              accent="text-blue-400"
            />
            <StatCard
              title="Total Bookings"
              value={userRole === "admin" ? bookings.length : carOwnerBookings.length}
              icon={FaCalendarAlt}
              color="from-violet-500/20 to-violet-500/5"
              accent="text-violet-400"
            />
            <StatCard
              title="Total Revenue"
              value={`₹ ${userRole === "admin" ? revenue : carOwnerRevenue}`}
              icon={FaMoneyBillWave}
              color="from-yellow-500/20 to-yellow-500/5"
              accent="text-yellow-400"
            />
          </div>

          {/* Visualizations Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-surface-900/50 rounded-[2rem] p-8 border border-white/5 shadow-premium">
              <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 opacity-50">Monthly Revenue Distribution</h3>
              <Chart />
            </div>
            <div className="bg-surface-900/50 rounded-[2rem] p-8 border border-white/5 shadow-premium">
              <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 opacity-50">Booking Volume Trends</h3>
              <Graph />
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-surface-900/50 rounded-[2.5rem] border border-white/5 shadow-premium overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary-500 rounded-full" />
                Recent Platform Activity
              </h2>
              <button className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-surface-400 hover:text-white hover:bg-white/10 transition-colors uppercase tracking-widest">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] text-[10px] uppercase font-black tracking-[0.2em] text-surface-500 border-b border-white/5">
                    <th className="px-8 py-6">Operator</th>
                    <th className="px-8 py-6">Asset</th>
                    <th className="px-8 py-6">Logistics</th>
                    <th className="px-8 py-6 text-right">Value</th>
                    <th className="px-8 py-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center text-primary-400 font-bold">
                            {booking.user?.fullname?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold group-hover:text-primary-400 transition-colors">{booking.user?.fullname || "Verified Guest"}</p>
                            <p className="text-[10px] text-surface-500 uppercase tracking-widest font-bold">Client ID: ...{booking._id.slice(-4)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="bg-surface-800/50 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5">
                          <FaCar className="text-surface-500 text-xs" />
                          <p className="text-white text-xs font-medium uppercase tracking-wider">{booking.car?.brand} {booking.car?.model}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                            <p className="text-xs text-white font-medium">{booking.rentalLocation.pickupLocation}</p>
                          </div>
                          <div className="flex items-center gap-2 translate-x-[3px] scale-y-150 py-0.5 ml-0.5">
                            <span className="w-[1px] h-full bg-white/10" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                            <p className="text-xs text-surface-400">{booking.rentalLocation.dropoffLocation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-display whitespace-nowrap">
                        <p className="text-white font-black text-lg">₹{booking.totalPrice}</p>
                        <p className="text-[9px] text-surface-600 uppercase tracking-widest font-bold">Payment Settled</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <StatusPill status={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentBookings.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-surface-600 font-bold uppercase tracking-widest text-xs">No recent activity detected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon: Icon, color, accent }) => (
  <div className={`relative group p-8 rounded-[2.5rem] bg-surface-900/50 border border-white/5 transition-all duration-500 hover:border-white/20 shadow-premium overflow-hidden`}>
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl bg-surface-800 border border-white/10 flex items-center justify-center ${accent} shadow-inner mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
        <Icon size={28} />
      </div>
      <p className="text-surface-500 text-[10px] uppercase font-black tracking-[0.25em] mb-2">{title}</p>
      <p className="text-3xl font-display font-black text-white tracking-tighter">{value}</p>
    </div>
  </div>
);

const StatusPill = ({ status }) => {
  const styles = {
    Completed: "bg-green-500/10 text-green-400 border-green-500/20",
    canceled: "bg-red-500/10 text-red-400 border-red-500/20",
    default: "bg-primary-500/10 text-primary-400 border-primary-500/20"
  };

  const currentStyle = styles[status] || styles.default;

  return (
    <span className={`inline-block px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border ${currentStyle} backdrop-blur-md`}>
      {status}
    </span>
  );
};

export default AdminReport;

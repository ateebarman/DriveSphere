import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { HiOutlineUserGroup, HiOutlineTruck, HiOutlineCalendar, HiOutlineCurrencyRupee, HiOutlineTrendingUp, HiOutlineShieldCheck } from "react-icons/hi";
import { GiProgression } from "react-icons/gi";
import { API_END_POINT_admin, API_END_POINT_CarOwner } from "../utils/constants";
import { motion } from "framer-motion";
import Skeleton from "./Common/Skeleton";

const RevenueReport = () => {
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
      const res = await axios.get(`${API_END_POINT_admin}/getallcars`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setCars(res.data);
    } catch (error) {
      console.error("Error fetching cars:", error.message);
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get(`${API_END_POINT_admin}/getallusers`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const getBookings = async () => {
    try {
      const res = await axios.get(`${API_END_POINT_admin}/allbookings`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setBookings(res.data);
      calculateRevenue(res.data, setRevenue, setLastMonthRevenue);
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
    }
  };

  const getOwnedCars = async () => {
    try {
      const res = await axios.get(`${API_END_POINT_CarOwner}/getallownedcars`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setOwnedCars(res.data.cars);
    } catch (error) {
      console.error("Error fetching owned cars:", error.message);
    }
  };

  const getCarOwnerBookings = async () => {
    try {
      const res = await axios.get(`${API_END_POINT_CarOwner}/CarOwnerBookingDetails`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setCarOwnerBookings(res.data.bookings);
      calculateRevenue(res.data.bookings, setCarOwnerRevenue, setLastMonthCarOwnerRevenue);
    } catch (error) {
      console.error("Error fetching car owner bookings:", error.message);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      let res;
      if (userRole === "admin") {
        res = await axios.get(`${API_END_POINT_admin}/recent-bookings`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      } else if (userRole === "carOwner") {
        res = await axios.get(`${API_END_POINT_CarOwner}/recent-bookings`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }
      setRecentBookings(res.data);
    } catch (error) {
      console.error("Error fetching recent bookings:", error.message);
    }
  };

  const calculateRevenue = (bookings, setTotalRevenue, setLastMonthRevenue) => {
    const currentDate = new Date();
    const lastMonth = currentDate.getMonth() - 1;
    const validBookings = bookings.filter((booking) => booking.status !== "canceled");

    let totalRevenue = 0;
    if (userRole === "admin") {
      totalRevenue = validBookings.reduce((total, booking) => total + (booking.totalPrice * 0.2), 0);
    } else if (userRole === "carOwner") {
      totalRevenue = validBookings.reduce((total, booking) => total + (booking.totalPrice * 0.8), 0);
    }

    const lastMonthRevenue = validBookings
      .filter((booking) => new Date(booking.rentalStartDate).getMonth() === lastMonth)
      .reduce((total, booking) => total + (booking.totalPrice * 0.8), 0);

    setTotalRevenue(totalRevenue);
    setLastMonthRevenue(lastMonthRevenue);
  };

  const StatCard = ({ title, value, icon: Icon, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 hover:border-white/10 transition-all duration-500 shadow-premium overflow-hidden flex-1 min-w-[280px]"
    >
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors" />
      <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${color} mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={28} />
      </div>
      <p className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mb-2">{title}</p>
      <h3 className="text-3xl font-display font-black text-white tracking-tight">{value}</h3>
    </motion.div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase">
            {userRole === "admin" ? "Administrative Intelligence" : "Operational Command"}
          </h2>
          <p className="text-surface-500 mt-2 font-medium italic">
            {userRole === "admin" ? "Global platform oversight and performance analytics." : "Fleet performance and revenue telemetry."}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Real-time Sync Active</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 rounded-[2.5rem] bg-surface-900/50 border border-white/5 p-8 flex flex-col justify-between">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <div className="space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-surface-900/50 border border-white/5 rounded-[3rem] p-10">
            <div className="flex justify-between mb-10">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-16 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="flex flex-wrap gap-6">
            {userRole === "admin" && (
              <StatCard title="Total Network Users" value={users.length} icon={HiOutlineUserGroup} color="text-primary-400" delay={0.1} />
            )}
            <StatCard
              title="Global Fleet Assets"
              value={userRole === "admin" ? cars.length : ownedCars.length}
              icon={HiOutlineTruck}
              color="text-accent-400"
              delay={0.2}
            />
            <StatCard
              title="Active Missions"
              value={userRole === "admin" ? bookings.length : carOwnerBookings.length}
              icon={HiOutlineCalendar}
              color="text-emerald-400"
              delay={0.3}
            />
            <StatCard
              title="Platform Revenue"
              value={`₹${(userRole === "admin" ? revenue : carOwnerRevenue).toLocaleString()}`}
              icon={HiOutlineCurrencyRupee}
              color="text-amber-400"
              delay={0.4}
            />
            <StatCard
              title="Last Month Performance"
              value={`₹${(userRole === "admin" ? lastMonthRevenue : lastMonthCarOwnerRevenue).toLocaleString()}`}
              icon={GiProgression}
              color="text-indigo-400"
              delay={0.5}
            />
          </div>

          <div className="relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-premium">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">Recent Deployments</h3>
              <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-widest">
                <HiOutlineTrendingUp size={16} />
                Live Feed
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]">
                    <th className="px-6 pb-2">Personnel</th>
                    <th className="px-6 pb-2">Asset</th>
                    <th className="px-6 pb-2">Deployment Hub</th>
                    <th className="px-6 pb-2">Contract Value</th>
                    <th className="px-6 pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking, i) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                    >
                      <td className="px-6 py-5 rounded-l-2xl border-y border-l border-white/5">
                        <p className="text-white font-bold text-sm">{booking.user?.fullname || "Unidentified"}</p>
                        <p className="text-[9px] text-surface-500 uppercase tracking-widest mt-0.5">{booking.user?.email || "No Data"}</p>
                      </td>
                      <td className="px-6 py-5 border-y border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/5 text-primary-400 group-hover:scale-110 transition-transform">
                            <HiOutlineTruck size={16} />
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm uppercase">{booking.car?.brand} {booking.car?.model}</p>
                            <p className="text-[9px] text-surface-500 uppercase tracking-widest leading-none mt-1">{booking.car?.regNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 border-y border-white/5">
                        <p className="text-white font-bold text-sm">{booking.rentalLocation.pickupLocation}</p>
                        <p className="text-[9px] text-surface-500 uppercase tracking-widest mt-0.5">Vector: Global</p>
                      </td>
                      <td className="px-6 py-5 border-y border-white/5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[9px] font-black text-emerald-500">₹</span>
                          <span className="text-lg font-display font-black text-white">{booking.totalPrice?.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 rounded-r-2xl border-y border-r border-white/5">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          booking.status === 'canceled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-primary-500/10 text-primary-400 border-primary-500/20'
                          }`}>
                          {booking.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {recentBookings.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-surface-600 mb-6">
                  <HiOutlineShieldCheck size={32} />
                </div>
                <p className="text-surface-500 font-medium italic">No recent mission data detected in this sector.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueReport;

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import { API_END_POINT_admin } from "../../utils/constants";

const Graph = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_END_POINT_admin}/allbookings?limit=all`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const bookings = response.data.bookings || response.data;
        console.log(bookings);


        // Initialize month mapping
        const monthMapping = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Process bookings to calculate monthly revenue
        const revenueData = bookings.reduce((acc, booking) => {
          if (booking.status === "canceled") return acc;

          const rentalStartDate = new Date(booking.rentalStartDate);
          const rentalEndDate = new Date(booking.rentalEndDate);
          const daysRented =
            (rentalEndDate - rentalStartDate) / (1000 * 60 * 60 * 24);
          const revenue = daysRented * ((booking.totalPrice * 0.2) / daysRented);

          const month = monthMapping[rentalStartDate.getMonth()];
          acc[month] = (acc[month] || 0) + revenue;
          return acc;
        }, {});

        // Convert revenue data to chart-compatible format
        const formattedData = monthMapping.map((month) => ({
          name: month,
          revenue: revenueData[month] || 0,
        }));

        setMonthlyRevenue(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey={"name"}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                backdropBlur: "8px",
                padding: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
              }}
              itemStyle={{ color: "#10B981", fontSize: "12px", fontWeight: "bold" }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={4}
              dot={{ fill: "#10B981", stroke: "#0f172a", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8, stroke: "#10B981", strokeWidth: 4, fill: "#0f172a" }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default Graph;

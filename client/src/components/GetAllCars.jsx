import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_END_POINT_admin } from "../utils/constants";
import Pagination from "./Common/Pagination";
import Skeleton from "./Common/Skeleton";

const GetAllCars = () => {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCars = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_END_POINT_admin}/getallcars?page=${page}&limit=10&search=${search}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setCars(res.data.cars);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching cars", error);
      setError("Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCars(currentPage, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };


  if (error) {
    return <p className="text-center text-lg font-medium text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">Fleet Inventory</h2>
          <p className="text-surface-500 mt-1 font-medium">Manage and monitor all vehicle assets across the platform.</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-2xl" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by model, brand, registration or fuel type..."
          className="relative w-full p-4 pl-6 rounded-2xl bg-surface-900/50 border border-white/10 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 transition-all backdrop-blur-xl"
        />
      </div>

      {/* Cars Table */}
      <div className="bg-surface-900/50 rounded-[2.5rem] border border-white/5 shadow-premium overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] uppercase font-black tracking-[0.2em] text-surface-500 border-b border-white/5">
                <th className="px-8 py-6">Model & Brand</th>
                <th className="px-8 py-6">Registration</th>
                <th className="px-8 py-6">Type</th>
                <th className="px-8 py-6">Color</th>
                <th className="px-8 py-6">Fuel System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-6 w-24 rounded-lg" />
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : cars.length > 0 ? (
                cars.map((car) => (
                  <tr key={car._id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6">
                      <div>
                        <p className="text-white text-sm font-bold group-hover:text-primary-400 transition-colors uppercase tracking-tight">{car.model}</p>
                        <p className="text-[10px] text-surface-500 uppercase tracking-widest font-black">{car.brand}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-lg bg-surface-800 border border-white/5 text-surface-300 text-[10px] font-mono font-bold tracking-tighter uppercase">
                        {car.regNumber}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-surface-400 font-medium">{car.type}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border border-white/10"
                          style={{ backgroundColor: car.color.toLowerCase() }}
                        />
                        <span className="text-sm text-surface-400 capitalize">{car.color}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
                        {car.fuelType}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <p className="text-surface-600 font-bold uppercase tracking-widest text-xs">No matching vehicles found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default GetAllCars;
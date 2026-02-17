import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_END_POINT_CarOwner } from "../../utils/constants";
import axios from "axios";
import CarImageSlider from "../CarImageSlider";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineCheckCircle, HiOutlineTruck } from "react-icons/hi";
import Pagination from "../Common/Pagination";
import Skeleton from "../Common/Skeleton";

const OwnedCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editCar, setEditCar] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

  const fetchCars = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_END_POINT_CarOwner}/getAllOwnedCars?page=${page}&limit=9`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setCars(response.data.cars);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("Telemetry failure: Unable to retrieve fleet data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCar = async (regToDelete) => {
    try {
      const response = await axios.delete(`${API_END_POINT_CarOwner}/deletecar`, {
        headers: { "Content-Type": "application/json" },
        data: { regNumber: regToDelete },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Asset decommissioned successfully.");
        fetchCars(currentPage); // Refresh current page
      }
    } catch (error) {
      toast.error("Decommissioning failed: System override required.");
    }
  };

  const handleEditCar = (car) => {
    setEditCar(car._id);
    setEditForm({ ...car });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_END_POINT_CarOwner}/editcar/${editCar}`,
        editForm,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Telemetry updated.");
        setCars(cars.map((car) => (car._id === editCar ? { ...car, ...editForm } : car)));
        setEditCar(null);
      }
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase">Fleet Inventory</h2>
          <p className="text-surface-500 mt-2 font-medium italic">Active assets currently deployed in the network.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface-900/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col h-[520px]">
              <Skeleton className="h-48 w-full rounded-2xl mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[1, 2, 3, 4, 5, 6].map(j => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </div>
              <div className="mt-auto flex gap-3 pt-6">
                <Skeleton className="h-14 flex-1" />
                <Skeleton className="h-14 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          <AnimatePresence mode="popLayout">
            {cars.map((car) => (
              <motion.div
                key={car._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/10 transition-all duration-500 shadow-premium"
              >
                <div className="relative h-56 overflow-hidden">
                  <CarImageSlider car={car} height="100%" />
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${car.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                      {car.status}
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                      {car.brand} <span className="text-primary-400">{car.model}</span>
                    </h3>
                    <p className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">{car.regNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Year', value: car.year },
                      { label: 'Type', value: car.type },
                      { label: 'Color', value: car.color },
                      { label: 'Seats', value: `${car.seats} Units` },
                      { label: 'Fuel', value: car.fuelType },
                      { label: 'Rate', value: `₹${car.rentalPricePerDay}/Day` }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/[0.02] rounded-2xl p-3 border border-white/5 text-center">
                        <p className="text-[8px] font-black text-surface-500 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-xs font-bold text-white uppercase">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleEditCar(car)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                    >
                      <HiOutlinePencilAlt size={18} />
                      Refactor
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Initiate decommissioning sequence?')) handleDeleteCar(car.regNumber);
                      }}
                      className="w-16 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-2xl transition-all flex items-center justify-center"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {editCar === car._id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 z-20 bg-surface-950/95 backdrop-blur-xl p-8 overflow-y-auto thin-scrollbar"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <h4 className="text-lg font-display font-black text-white uppercase">Refactor Asset</h4>
                        <button onClick={() => setEditCar(null)} className="text-surface-500 hover:text-white uppercase text-[10px] font-black tracking-widest">Cancel</button>
                      </div>

                      <form onSubmit={handleSaveEdit} className="grid grid-cols-1 gap-4">
                        {['brand', 'model', 'color', 'type'].map(field => (
                          <div key={field}>
                            <label className="text-[8px] font-black text-surface-500 uppercase tracking-widest ml-1">{field}</label>
                            <input
                              type="text"
                              className="premium-input text-sm !py-3 !px-4 mt-1"
                              value={editForm[field]}
                              onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                              required
                            />
                          </div>
                        ))}
                        <div className="grid grid-cols-2 gap-4">
                          {['year', 'seats', 'mileage', 'rentalPricePerDay'].map(field => (
                            <div key={field}>
                              <label className="text-[8px] font-black text-surface-500 uppercase tracking-widest ml-1">{field}</label>
                              <input
                                type="number"
                                className="premium-input text-sm !py-3 !px-4 mt-1"
                                value={editForm[field]}
                                onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                                required
                              />
                            </div>
                          ))}
                        </div>
                        <div>
                          <label className="text-[8px] font-black text-surface-500 uppercase tracking-widest ml-1">Status</label>
                          <select
                            className="premium-input text-sm !py-3 !px-4 mt-1 cursor-pointer appearance-none"
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          >
                            <option value="available" className="bg-surface-900">Available</option>
                            <option value="maintenance" className="bg-surface-900">Maintenance</option>
                            <option value="booked" className="bg-surface-900">Booked</option>
                          </select>
                        </div>
                        <button type="submit" className="premium-button w-full mt-4 flex items-center justify-center gap-2">
                          <HiOutlineCheckCircle size={20} />
                          Commit Changes
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {cars.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-surface-600 mb-8 border border-white/10">
                <HiOutlineTruck size={40} />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest">No Assets Detected</h3>
              <p className="text-surface-500 mt-2 font-light max-w-xs mx-auto">Your fleet is currently offline. Deploy your first vehicle to begin operations.</p>
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

export default OwnedCars;

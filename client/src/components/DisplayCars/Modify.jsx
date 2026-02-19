import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  setLocation,
  setStartDateInStore,
  setDropDateInStore,
} from "../../redux/carSlice";
import { motion } from "framer-motion";
import { HiOutlineRefresh, HiOutlineLocationMarker, HiOutlineCalendar } from "react-icons/hi";

const Modify = () => {
  const location = useSelector((state) => state.car.location);
  const startDate = useSelector((state) => state.car.startDate);
  const dropDate = useSelector((state) => state.car.dropDate);
  const dispatch = useDispatch();

  const [selectedLocation, setSelectedLocation] = useState(location);
  const [selectedStartDate, setSelectedStartDate] = useState(startDate);
  const [selectedDropDate, setSelectedDropDate] = useState(dropDate);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(setLocation(selectedLocation));
    dispatch(setStartDateInStore(selectedStartDate));
    dispatch(setDropDateInStore(selectedDropDate));
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-surface-900/50 backdrop-blur-3xl p-3 md:p-4 rounded-[2rem] md:rounded-[3rem] flex flex-col lg:flex-row items-stretch lg:items-center gap-3 md:gap-4 border border-white/5 shadow-premium"
      >
        {/* Location Selector */}
        <div className="flex-1 flex items-center gap-4 px-5 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-[2.5rem] bg-white/[0.03] border border-white/5 group-focus-within:border-primary-500/50 transition-all">
          <HiOutlineLocationMarker className="text-primary-400 text-lg md:text-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="block text-[8px] font-black text-surface-500 uppercase tracking-[0.2em] mb-0.5">Deployment Hub</label>
            <select
              className="w-full bg-transparent text-white focus:outline-none appearance-none cursor-pointer text-xs md:text-sm font-bold uppercase tracking-tight truncate"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="" disabled className="bg-surface-900 italic">Select Vector</option>
              {["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Amravati"].map(city => (
                <option key={city} value={city} className="bg-surface-900">{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Start Date */}
        <div className="flex-1 flex items-center gap-4 px-5 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-[2.5rem] bg-white/[0.03] border border-white/5 group-focus-within:border-primary-500/50 transition-all">
          <HiOutlineCalendar className="text-emerald-400 text-lg md:text-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="block text-[8px] font-black text-surface-500 uppercase tracking-[0.2em] mb-0.5">Acquisition Epoch</label>
            <input
              type="datetime-local"
              className="w-full bg-transparent text-white focus:outline-none text-[10px] md:text-xs font-bold [color-scheme:dark]"
              value={selectedStartDate}
              onChange={(e) => setSelectedStartDate(e.target.value)}
            />
          </div>
        </div>

        {/* Drop Date */}
        <div className="flex-1 flex items-center gap-4 px-5 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-[2.5rem] bg-white/[0.03] border border-white/5 group-focus-within:border-primary-500/50 transition-all">
          <HiOutlineCalendar className="text-rose-400 text-lg md:text-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="block text-[8px] font-black text-surface-500 uppercase tracking-[0.2em] mb-0.5">Return Deadline</label>
            <input
              type="datetime-local"
              className="w-full bg-transparent text-white focus:outline-none text-[10px] md:text-xs font-bold [color-scheme:dark]"
              value={selectedDropDate}
              onChange={(e) => setSelectedDropDate(e.target.value)}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="lg:w-auto w-full group relative overflow-hidden flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2.5rem] bg-primary-500 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-premium hover:bg-primary-600 transition-all duration-500 active:scale-95"
        >
          <HiOutlineRefresh className="text-base md:text-lg group-hover:rotate-180 transition-transform duration-700" />
          <span>Synchronize</span>
        </button>
      </form>
    </motion.div>
  );
};

export default Modify;
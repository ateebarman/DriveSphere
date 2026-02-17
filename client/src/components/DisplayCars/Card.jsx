import { useNavigate } from "react-router-dom";
import React, { forwardRef } from "react";
import carImg from "../../assets/carImg.jpeg";
import CarImageSlider from "../CarImageSlider";
import { motion } from "framer-motion";
import { HiOutlineLocationMarker, HiOutlineLightningBolt, HiChip } from "react-icons/hi";

const Card = forwardRef(({ car }, ref) => {
  const navigate = useNavigate();

  const handleBookButton = (car) => {
    navigate("/bookingpage", { state: { car } });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, transition: { duration: 0.4, ease: "easeOut" } }}
      className="group relative w-full glass-card rounded-[2.5rem] overflow-hidden transition-all duration-500 border border-white/5 hover:border-primary-500/50 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]"
    >
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <CarImageSlider car={car} />

        {/* Badges */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          <span className="px-4 py-1.5 bg-surface-950/40 backdrop-blur-xl rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-primary-400 border border-primary-500/20 shadow-xl">
            {car.type}
          </span>
          <span className={`px-4 py-1.5 bg-surface-950/40 backdrop-blur-xl rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-xl ${car.transmission === 'automatic' ? 'text-emerald-400 border-emerald-500/20' : 'text-orange-400 border-orange-500/20'
            }`}>
            {car.transmission}
          </span>
        </div>
      </div>

      <div className="p-8 relative">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between items-start">
            <h5 className="text-2xl font-display font-black text-white group-hover:text-primary-400 transition-colors tracking-tight uppercase">
              {car.brand} <span className="text-surface-500 group-hover:text-surface-300">{car.model}</span>
            </h5>
          </div>
          <div className="flex items-center gap-2 text-surface-500 text-[10px] font-black uppercase tracking-widest mt-2">
            <HiOutlineLocationMarker className="text-primary-500 text-sm" />
            <span>Deployment Hub: {car.currentLocation}</span>
          </div>
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-primary-500/20 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <HiOutlineLightningBolt size={18} />
            </div>
            <div>
              <p className="text-[8px] font-black text-surface-600 uppercase tracking-widest leading-none mb-1">Energy</p>
              <p className="text-xs font-black text-surface-200 uppercase">{car.fuelType}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-primary-500/20 transition-all">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
              <HiChip size={18} />
            </div>
            <div>
              <p className="text-[8px] font-black text-surface-600 uppercase tracking-widest leading-none mb-1">Efficiency</p>
              <p className="text-xs font-black text-surface-200 uppercase">{car.mileage} <span className="opacity-50">km/L</span></p>
            </div>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div>
            <span className="text-[9px] text-surface-500 uppercase font-black tracking-[0.3em] block mb-1">Daily Access</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-primary-500 uppercase">₹</span>
              <span className="text-3xl font-display font-black text-white tracking-tighter">
                {car.rentalPricePerDay.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleBookButton(car)}
            className="relative overflow-hidden group/btn px-8 py-4 bg-primary-500 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:bg-primary-600 hover:shadow-[0_15px_30px_rgba(59,130,246,0.4)] transition-all active:scale-95"
          >
            <span className="relative z-10">Configure</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default Card;

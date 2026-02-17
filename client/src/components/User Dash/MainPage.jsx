import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineTrendingUp, HiOutlineMap } from 'react-icons/hi';

const MainPage = () => {
  const user = useSelector((state) => state.app.user);

  const stats = [
    { label: 'Platform Tier', value: 'Prime', icon: HiOutlineShieldCheck, color: 'text-primary-400' },
    { label: 'Active Missions', value: '02', icon: HiOutlineTrendingUp, color: 'text-emerald-400' },
    { label: 'Distance Vector', value: '1,240 km', icon: HiOutlineMap, color: 'text-accent-400' },
    { label: 'Loyalty Rating', value: '9.8', icon: HiOutlineLightningBolt, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-12">
      {/* Header Hub */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase leading-none">
            Welcome, <span className="text-primary-500">{user?.fullname?.split(' ')[0] || 'Personnel'}</span>
          </h1>
          <p className="text-surface-500 mt-4 font-medium italic text-lg tracking-wide uppercase">
            System status: <span className="text-emerald-500 not-italic font-black">Optimal</span> | Node: MH-Central
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 border border-primary-500/20">
            <HiOutlineTrendingUp size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Growth Vector</p>
            <p className="text-xs font-bold text-surface-500">+12% performance this epoch</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 hover:border-white/10 transition-all duration-500 shadow-premium overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors" />

            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={28} />
            </div>

            <p className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-display font-black text-white tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Featured Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative group overflow-hidden rounded-[3rem] border border-white/5 shadow-premium">
          <img
            src="https://images.unsplash.com/photo-1544636331-e26879bc4d8e?auto=format&fit=crop&q=80&w=2000"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-transparent" />

          <div className="relative p-12 h-full flex flex-col justify-end min-h-[400px]">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500 text-[10px] font-black text-white uppercase tracking-widest mb-6 w-fit">
              Prime Experience
            </span>
            <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter mb-4 leading-tight">
              Expand Your <br />Operational Reach
            </h2>
            <p className="text-surface-300 max-w-md font-medium text-lg leading-relaxed">
              Upgrade your current deployment tier to unlock access to the elite supercar registry.
            </p>
          </div>
        </div>

        <div className="bg-primary-500/10 backdrop-blur-3xl border border-primary-500/20 rounded-[3rem] p-12 flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-3xl bg-primary-500 flex items-center justify-center text-white mb-8 shadow-xl">
              <HiOutlineLightningBolt size={32} />
            </div>
            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-4">Launch Mission</h3>
            <p className="text-surface-400 font-medium italic">Ready to deploy a new asset? Browser the registry for immediate availability.</p>
          </div>

          <button className="w-full py-5 rounded-2xl bg-white text-surface-950 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-surface-100 transition-all font-display mt-12">
            Scan Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

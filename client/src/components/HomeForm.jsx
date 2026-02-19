import { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setLocation,
  setStartDateInStore,
  setDropDateInStore,
} from "../redux/carSlice";
import { MdOutlineCancel } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineSupport,
  HiOutlineTrendingUp,
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
  HiOutlineViewGridAdd,
  HiOutlineMailOpen
} from "react-icons/hi";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

const HomeForm = () => {
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [toggle, setToggle] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const calculateDuration = (startDate, dropDate) => {
    if (startDate && dropDate) {
      const startDateObj = new Date(startDate);
      const dropDateObj = new Date(dropDate);
      const diffInMs = dropDateObj - startDateObj;

      if (diffInMs >= 0) {
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

        return diffInDays > 0
          ? `${diffInDays} days, ${diffInHours} hrs`
          : `${diffInHours} hrs, ${diffInMinutes} mins`;
      }
      return "Invalid duration";
    }
    return "";
  };

  const handleDateChange = (type, value) => {
    if (type === "start") {
      setStartDate(value);
      dispatch(setStartDateInStore(value));
      const startDateObj = new Date(value);
      const nextDay = new Date(startDateObj.getTime() + 24 * 60 * 60 * 1000);
      const localISO = nextDay.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).replace(" ", "T");
      setDropDate(localISO);
      dispatch(setDropDateInStore(localISO));
      setDuration(calculateDuration(value, localISO));
    } else if (type === "drop") {
      setDropDate(value);
      dispatch(setDropDateInStore(value));
      setDuration(calculateDuration(startDate, value));
    }
  };

  const handleBookNow = (event) => {
    event.preventDefault();
    navigate("/cards");
  };

  const handleLocationChange = (e) => {
    dispatch(setLocation(e.target.value));
  };

  const handleToggle = () => {
    const nextState = !toggle;
    setToggle(nextState);
    if (nextState) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="bg-surface-950 min-h-screen overflow-x-hidden">
      <Navbar toggle={toggle} setToggle={setToggle} />

      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070"
            className="w-full h-full object-cover"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-20 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl lg:text-left text-center"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs md:text-sm font-semibold mb-6 uppercase tracking-wider"
            >
              Ultimate Freedom on Wheels
            </motion.span>
            <h1 className="text-white text-4xl md:text-6xl lg:text-8xl font-display font-extrabold leading-tight mb-6 md:mb-8">
              Premium Car <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500">
                Rental Services.
              </span>
            </h1>
            <p className="text-surface-300 text-base md:text-xl mb-8 md:mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
              Experience prestige and comfort. Whether it's a weekend getaway or a business trip, our fleet is ready for your story.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 items-center justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggle}
                className="premium-button w-full sm:w-auto px-10 py-4 md:py-5 text-lg md:text-xl flex items-center justify-center gap-3 shadow-2xl"
              >
                Find Your Ride <HiOutlineArrowRight />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="premium-button w-full sm:w-auto bg-surface-800 hover:bg-surface-700 !px-10 !py-4 md:!py-5 text-lg md:text-xl flex items-center justify-center gap-3 border border-white/10"
              >
                List Your Car <HiOutlineViewGridAdd className="text-primary-400" />
              </motion.button>

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 mt-4 sm:mt-0">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <img
                      key={i}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-surface-950 object-cover"
                      src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`}
                      alt="user"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-white font-bold text-xs md:text-sm">2,500+</p>
                  <p className="text-surface-500 text-[8px] md:text-[10px] uppercase font-bold tracking-widest">Happy Clients</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Form Area */}
          <AnimatePresence>
            {toggle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 15 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                className="lg:ml-auto w-full max-w-lg glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] relative shadow-premium border-white/10"
              >
                <button
                  className="absolute top-6 right-6 md:top-8 md:right-8 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all transform hover:rotate-90"
                  onClick={handleToggle}
                >
                  <MdOutlineCancel size={24} />
                </button>

                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 md:mb-8 pr-12">Search Fleet</h2>

                <form onSubmit={handleBookNow} className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] md:text-sm font-semibold text-surface-200 ml-1 uppercase tracking-widest">
                      <HiOutlineLocationMarker className="text-primary-400" />
                      Pickup City
                    </label>
                    <select
                      className="premium-input appearance-none cursor-pointer text-sm"
                      onChange={handleLocationChange}
                      required
                      defaultValue=""
                    >
                      <option value="" disabled className="bg-surface-900">Select City</option>
                      {["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Amravati"].map((city) => (
                        <option key={city} value={city} className="bg-surface-900">
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] md:text-sm font-semibold text-surface-200 ml-1 uppercase tracking-widest">
                        <HiOutlineCalendar className="text-primary-400" />
                        Pickup
                      </label>
                      <input
                        className="premium-input text-xs md:text-sm"
                        type="datetime-local"
                        value={startDate}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => handleDateChange("start", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] md:text-sm font-semibold text-surface-200 ml-1 uppercase tracking-widest">
                        <HiOutlineCalendar className="text-primary-400" />
                        Drop-off
                      </label>
                      <input
                        className="premium-input text-xs md:text-sm"
                        type="datetime-local"
                        value={dropDate}
                        min={startDate || new Date().toISOString().slice(0, 16)}
                        onChange={(e) => handleDateChange("drop", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {duration && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-primary-300"
                    >
                      <HiOutlineClock size={20} className="md:size-6" />
                      <div className="flex flex-col">
                        <span className="text-[8px] md:text-[10px] uppercase font-bold text-surface-500 tracking-widest">Estimation</span>
                        <span className="text-xs md:text-sm font-bold text-white">{duration}</span>
                      </div>
                    </motion.div>
                  )}

                  <button className="premium-button w-full py-4 md:py-5 text-base md:text-lg font-bold shadow-primary-500/25">
                    Check Availability
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-10 md:-mt-20 container mx-auto px-6 pb-20 md:pb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {[
            { label: 'Vehicles', value: '450+', icon: HiOutlineLightningBolt, color: 'text-primary-400' },
            { label: 'Destinations', value: '12', icon: HiOutlineLocationMarker, color: 'text-accent-400' },
            { label: 'Booking Rate', value: '99%', icon: HiOutlineTrendingUp, color: 'text-green-400' },
            { label: 'Support', value: '24/7', icon: HiOutlineSupport, color: 'text-primary-400' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              {...fadeIn}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-white/5 text-center group"
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} className="md:size-7" />
              </div>
              <h3 className="text-2xl md:text-4xl font-display font-extrabold text-white mb-1">{stat.value}</h3>
              <p className="text-surface-500 text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-6 py-16 md:py-32">
        <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
          <motion.div {...fadeIn} className="lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
            <span className="text-primary-400 font-bold uppercase tracking-widest text-xs md:text-sm">Premium Security</span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight">
              Driven by Excellence, <br />
              <span className="text-surface-500">Defined by Quality.</span>
            </h2>
            <div className="space-y-4 md:space-y-6">
              {[
                { title: 'Full Insurance', desc: 'Secure travel with zero liability.', icon: HiOutlineShieldCheck },
                { title: 'Best Price Guarantee', desc: 'Luxury rates that fit your budget.', icon: HiOutlineTrendingUp },
                { title: 'Global 24/7 Support', desc: 'We are here when you need us.', icon: HiOutlineSupport }
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center lg:items-start text-center sm:text-left">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 backdrop-blur-xl shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center text-primary-400 border border-white/10 shadow-lg">
                    <item.icon size={24} className="md:size-7" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{item.title}</h4>
                    <p className="text-surface-400 text-sm md:text-base font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            {...fadeIn}
            transition={{ delay: 0.3 }}
            className="lg:w-1/2 relative w-full"
          >
            <div className="absolute -inset-4 md:-inset-10 bg-primary-500/20 blur-[60px] md:blur-[120px] rounded-full"></div>
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000"
              className="rounded-[2rem] md:rounded-[3rem] relative z-10 shadow-2xl border border-white/10 w-full object-cover aspect-[4/3] lg:aspect-auto"
              alt="Luxury Car"
            />
            <div className="absolute -bottom-4 -left-4 md:-bottom-10 md:-left-10 glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl z-20 border-white/20 animate-float hidden sm:block">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                  <HiOutlineShieldCheck size={24} className="md:size-7" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm md:text-base">Verified Fleet</p>
                  <p className="text-[8px] md:text-[10px] text-surface-500 font-bold uppercase">100% Inspection Passed</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-surface-900/40 py-24 md:py-40 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20 space-y-4">
            <span className="text-accent-400 font-bold uppercase tracking-widest text-xs md:text-sm">Our Process</span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">Three Steps to Freedom</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: '01', title: 'Choose Your Car', desc: 'Select from our wide range of premium vehicles at best prices.', icon: HiOutlineViewGridAdd },
              { step: '02', title: 'Pick a Date', desc: 'Enter your destination and rental timeline for instant booking.', icon: HiOutlineCalendar },
              { step: '03', title: 'Start Driving', desc: 'Enjoy your journey with our seamless contactless pickup.', icon: HiOutlineLightningBolt }
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.2 }}
                className="relative p-8 md:p-10 glass-card rounded-[2rem] md:rounded-[2.5rem] border-white/5 group hover:border-primary-500/30 transition-all"
              >
                <div className="absolute top-6 right-6 md:top-8 md:right-8 text-4xl md:text-6xl font-display font-black text-white/5 group-hover:text-primary-500/10 transition-colors">
                  {item.step}
                </div>
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary-400 mb-6 md:mb-8 border border-primary-500/20">
                  <item.icon size={28} className="md:size-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">{item.title}</h3>
                <p className="text-surface-400 text-sm md:text-base leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Newsletter */}
      <section className="container mx-auto px-6 py-24 md:py-40">
        <motion.div
          {...fadeIn}
          className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-primary-600 to-accent-600 p-8 md:p-24 text-center"
        >
          <div className="absolute inset-0 bg-surface-950/20 backdrop-blur-3xl"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-primary-400/20 blur-[60px] md:blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 md:w-96 md:h-96 bg-accent-400/20 blur-[60px] md:blur-[100px] rounded-full"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-7xl font-display font-extrabold text-white leading-tight">
              Ready to Hit the Open Road?
            </h2>
            <p className="text-white/80 text-base md:text-xl font-light">
              Join thousands of adventurers who travel with absolute comfort and total peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/cards')} className="bg-white text-surface-950 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-surface-100 transition-all transform hover:scale-105">
                Explore Fleet
              </button>
              <div className="flex items-center justify-center gap-2 group cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 md:px-10 md:py-5 rounded-full text-white font-bold hover:bg-white/20 transition-all">
                <HiOutlineMailOpen size={20} className="md:size-6" />
                <span className="text-sm md:text-base">Subscribe for offers</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-950 border-t border-white/5 pt-16 md:pt-24 pb-8 md:pb-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
          <div className="md:col-span-2 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-xl">
                D
              </div>
              <h1 className="text-white text-2xl md:text-3xl font-display font-bold tracking-tight">
                Drive<span className="text-primary-400">Sphere</span>
              </h1>
            </div>
            <p className="text-surface-500 max-w-sm leading-relaxed text-sm">
              The world's leading premium car rental agency. We provide unparalleled comfort and style for every journey you undertake.
            </p>
            <div className="flex gap-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-surface-400 hover:bg-primary-500 hover:text-white transition-all transform hover:-translate-y-1 border border-white/5">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 md:mb-8 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-3 md:space-y-4 text-surface-500 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Our Fleet</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Rental Policies</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Corporate Programs</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Membership</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 md:mb-8 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-3 md:space-y-4 text-surface-500 text-sm">
              <li className="flex items-center gap-3"><HiOutlineLocationMarker className="text-primary-400" /> 123 Luxury Lane, Mumbai</li>
              <li className="flex items-center gap-3"><HiOutlineSupport className="text-primary-400" /> +91 (22) 1234 5678</li>
              <li className="flex items-center gap-3"><HiOutlineMailOpen className="text-primary-400" /> concierge@drivesphere.com</li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-6 pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-surface-600 text-[10px] md:text-xs uppercase tracking-widest font-bold">
          <p className="text-center md:text-left">© 2026 DriveSphere Global. All rights reserved.</p>
          <div className="flex gap-4 md:gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeForm;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { API_END_POINT } from "../utils/constants";
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ toggle, setToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_END_POINT}/logout`);
      if (res.data.success) {
        toast.success(res.data.message);
      }
      dispatch(setUser(null));
      localStorage.removeItem("user");
      navigate("/");
      setIsMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDashboardClick = () => {
    if (!user) {
      const redirectPaths = {
        userDash: "/userdash",
        adminDash: "/admindash",
        carOwnerDash: "/carownerdash",
      };
      localStorage.setItem("redirectPath", JSON.stringify(redirectPaths));
      handleLogin();
      return;
    }

    if (user.role === "admin") {
      navigate("/admindash");
    } else if (user.role === "carOwner") {
      navigate("/carownerdash");
    } else {
      navigate("/userdash");
    }
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleToggle = () => {
    const nextState = !toggle;
    setToggle(nextState);
    if (nextState) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled || isMenuOpen
        ? "bg-surface-950/90 backdrop-blur-xl border-b border-white/10 py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
            D
          </div>
          <h1 className="text-white text-2xl font-display font-bold tracking-tight">
            Drive<span className="text-primary-400">Sphere</span>
          </h1>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-8">
          {user && (
            <button
              onClick={handleDashboardClick}
              className="text-surface-200 hover:text-white font-medium transition-colors"
            >
              Dashboard
            </button>
          )}

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <CgProfile size="20px" className="text-primary-400" />
                <span className="text-sm font-medium text-surface-200">{user?.fullname}</span>
              </div>
            )}

            <button
              className="premium-button bg-surface-800 hover:bg-surface-700 !px-6"
              onClick={handleToggle}
            >
              {toggle ? "Close Search" : "Find a Car"}
            </button>

            <button
              type="button"
              onClick={user ? logoutHandler : handleLogin}
              className="premium-button"
            >
              {user ? "Sign Out" : "Sign In"}
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-surface-950 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {user && (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <CgProfile size="32px" className="text-primary-400" />
                  <div>
                    <p className="text-white font-bold">{user?.fullname}</p>
                    <p className="text-surface-400 text-xs">{user?.role}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {user && (
                  <button
                    onClick={handleDashboardClick}
                    className="flex items-center justify-between p-4 text-white font-medium hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <span>Dashboard</span>
                    <HiMenuAlt3 className="text-primary-400 rotate-90" />
                  </button>
                )}

                <button
                  onClick={handleToggle}
                  className="flex items-center justify-between p-4 text-white font-medium hover:bg-white/5 rounded-xl transition-colors"
                >
                  <span>{toggle ? "Close Search" : "Find a Car"}</span>
                  <div className="w-2 h-2 rounded-full bg-primary-400" />
                </button>

                <button
                  onClick={user ? logoutHandler : handleLogin}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${user
                    ? "bg-white/5 text-white border border-white/10"
                    : "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/20"
                    }`}
                >
                  {user ? "Sign Out" : "Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

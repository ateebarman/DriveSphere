import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { API_END_POINT } from "../utils/constants.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone } from "react-icons/hi";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mobileNoRef = useRef();
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleLoginMode = () => {
    setIsLogin((prevState) => !prevState);
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const mobileNo = mobileNoRef.current?.value;
    const selectedRole = role;

    if (!isLogin && (!mobileNo || !/^\d{10}$/.test(mobileNo))) {
      toast.error("Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    const user = isLogin
      ? { email, password }
      : { fullname, email, password, role: selectedRole, mobileNo };

    const url = `${API_END_POINT}/${isLogin ? "login" : "register"}`;
    const successMessage = isLogin ? "Welcome back to DriveSphere!" : "Account created successfully!";

    try {
      const res = await axios.post(url, user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(successMessage);
        if (isLogin) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          dispatch(setUser(res.data.user));
          const userRole = res.data.user.role;
          const redirectPaths = JSON.parse(localStorage.getItem("redirectPath")) || {};
          let redirectPath;

          if (userRole === "user") {
            // Priority 1: Specifically stored redirect path (e.g. from a booking attempt)
            // Priority 2: If they were just browsing, go back to cards
            // Priority 3: Default to user dashboard
            redirectPath = redirectPaths.userDash || "/userdash";
          } else if (userRole === "admin") {
            redirectPath = redirectPaths.adminDash || "/admindash";
          } else if (userRole === "carOwner") {
            redirectPath = redirectPaths.carOwnerDash || "/carownerdash";
          } else {
            redirectPath = "/";
          }

          navigate(redirectPath);
          localStorage.removeItem("redirectPath");
        } else {
          setIsLogin(true);
        }
        setFullname("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `${isLogin ? "Login" : "Registration"} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-surface-950 flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-900/20 blur-[120px] rounded-full"></div>

      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1598084991519-c90900bc9df0?auto=format&fit=crop&q=80&w=2070"
          className="w-full h-full object-cover opacity-20 grayscale"
          alt="Login Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-surface-950/80 to-surface-950"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-6 will-change-transform"
      >
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 shadow-premium">
          <div className="text-center mb-10">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="inline-block w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mb-6 shadow-xl"
            >
              D
            </motion.div>
            <h1 className="text-3xl font-display font-extrabold text-white mb-2 tracking-tight">
              {isLogin ? "Welcome Back" : "Start Your Journey"}
            </h1>
            <p className="text-surface-400">
              {isLogin ? "Enter your credentials to access your fleet" : "Join the premium car rental network today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 ml-1">
                    <HiOutlineUser className="text-primary-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="John Doe"
                    className="premium-input"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 ml-1">
                <HiOutlineMail className="text-primary-400" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="premium-input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 ml-1">
                <HiOutlineLockClosed className="text-primary-400" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="premium-input"
                required
              />
            </div>

            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 ml-1">
                    <HiOutlinePhone className="text-primary-400" />
                    Mobile No.
                  </label>
                  <input
                    ref={mobileNoRef}
                    type="text"
                    maxLength="10"
                    placeholder="10-digit number"
                    className="premium-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-surface-200 ml-1 block">Role</label>
                  <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
                    <button
                      type="button"
                      onClick={() => setRole("user")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${role === "user" ? "bg-primary-600 text-white" : "text-surface-400 hover:text-white"
                        }`}
                    >
                      USER
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("carOwner")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${role === "carOwner" ? "bg-primary-600 text-white" : "text-surface-400 hover:text-white"
                        }`}
                    >
                      OWNER
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="premium-button w-full py-4 text-lg font-bold shadow-primary-500/25 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-surface-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleLoginMode}
                className="ml-2 text-primary-400 font-bold hover:text-primary-300 transition-colors"
              >
                {isLogin ? "Sign Up Now" : "Sign In Now"}
              </button>
            </p>
            {isLogin && (
              <button className="text-surface-500 text-xs hover:text-surface-300 transition-colors">
                Forgot your password?
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

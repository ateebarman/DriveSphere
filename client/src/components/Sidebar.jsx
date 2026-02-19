import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setClickedOption } from "../redux/adminSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineUserCircle,
  HiOutlineViewGrid,
  HiOutlineTruck,
  HiOutlineUsers,
  HiOutlineBookOpen,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineLibrary,
  HiOutlinePlusCircle,
  HiOutlineClipboardList,
  HiChevronLeft,
  HiMenuAlt2
} from "react-icons/hi";

const Sidebar = ({ isCollapsed, setIsCollapsed, onOptionClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const userRole = user?.role;
  const adminClickedOption = useSelector((state) => state.admin.clickedOption);

  const handleLogOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
    if (onOptionClick) onOptionClick();
  };

  const NavItem = ({ icon: Icon, label, onClick, active }) => (
    <motion.li
      whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 5 }}
      whileTap={{ scale: 0.98 }}
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active
        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
        : "text-surface-400 hover:bg-white/5 hover:text-white"
        } ${isCollapsed ? "justify-center px-0" : ""}`}
      onClick={onClick}
    >
      <div className="relative shrink-0">
        <Icon className={`text-lg ${active ? "text-white" : "text-surface-500 group-hover:text-primary-400"} transition-colors`} />
        {isCollapsed && active && (
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white border-2 border-primary-500" />
        )}
      </div>
      {!isCollapsed && (
        <span className={`text-sm tracking-wide ${active ? "font-bold" : "font-medium"}`}>{label}</span>
      )}
      {!isCollapsed && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
    </motion.li>
  );

  const SectionHeader = ({ children }) => (
    !isCollapsed && (
      <p className="px-4 text-[10px] uppercase font-black text-surface-600 tracking-[0.25em] mb-4 mt-8 first:mt-0">
        {children}
      </p>
    )
  );

  const handleOptionClick = (option) => {
    dispatch(setClickedOption(option));
    if (userRole === "admin") navigate("/admindash");
    else if (userRole === "carOwner") navigate("/carownerdash");
    else navigate("/userdash");
    if (onOptionClick) onOptionClick();
  };

  const handleLogoClick = () => {
    navigate("/");
    if (onOptionClick) onOptionClick();
  };

  return (
    <div className="flex flex-col h-full py-8 px-6 select-none bg-surface-900 border-r border-white/5">
      {/* Brand Logo */}
      <div
        onClick={handleLogoClick}
        className={`flex items-center gap-3 mb-12 px-2 cursor-pointer group ${isCollapsed ? "justify-center px-0" : ""}`}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-premium shrink-0">
          D
        </div>
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-white text-xl font-display font-black tracking-tighter leading-none">
              Drive<span className="text-primary-400">Sphere</span>
            </h1>
            <p className="text-[8px] text-surface-500 uppercase tracking-[0.3em] mt-1 font-bold">Premium Fleet</p>
          </motion.div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 no-scrollbar">
        <ul className="space-y-1">
          <SectionHeader>Navigation</SectionHeader>
          <NavItem
            icon={HiOutlineLibrary}
            label="Return Home"
            active={false}
            onClick={() => {
              navigate("/");
              if (onOptionClick) onOptionClick();
            }}
          />
          <NavItem
            icon={HiOutlineTruck}
            label="Explore Fleet"
            active={adminClickedOption === "Explore Fleet"}
            onClick={() => {
              dispatch(setClickedOption("Explore Fleet"));
              navigate("/cards");
              if (onOptionClick) onOptionClick();
            }}
          />

          {(userRole === "admin" || userRole === "carOwner") && (
            <NavItem
              icon={HiOutlineViewGrid}
              label="Dashboard"
              active={adminClickedOption === "dashboard"}
              onClick={() => handleOptionClick("dashboard")}
            />
          )}

          {userRole === "admin" && (
            <>
              <SectionHeader>Fleet Management</SectionHeader>
              <NavItem icon={HiOutlineTruck} label="View All Cars" active={adminClickedOption === "View All Cars"} onClick={() => handleOptionClick("View All Cars")} />
              <NavItem icon={HiOutlinePlusCircle} label="Add New Car" active={adminClickedOption === "Add New Car"} onClick={() => handleOptionClick("Add New Car")} />
              <NavItem icon={HiOutlineTruck} label="Delete car" active={adminClickedOption === "Delete car"} onClick={() => handleOptionClick("Delete car")} />

              <SectionHeader>Personnel</SectionHeader>
              <NavItem icon={HiOutlineUsers} label="View All Users" active={adminClickedOption === "View All Users"} onClick={() => handleOptionClick("View All Users")} />
              <NavItem icon={HiOutlineUsers} label="Change User Role" active={adminClickedOption === "Change User Role"} onClick={() => handleOptionClick("Change User Role")} />
              <NavItem icon={HiOutlineUsers} label="Get User" active={adminClickedOption === "Get User"} onClick={() => handleOptionClick("Get User")} />
              <NavItem icon={HiOutlineUsers} label="Delete User" active={adminClickedOption === "Delete User"} onClick={() => handleOptionClick("Delete User")} />

              <SectionHeader>Operations</SectionHeader>
              <NavItem icon={HiOutlineBookOpen} label="View All Bookings" active={adminClickedOption === "View All Bookings"} onClick={() => handleOptionClick("View All Bookings")} />
            </>
          )}

          {userRole === "carOwner" && (
            <>
              <SectionHeader>My Assets</SectionHeader>
              <NavItem icon={HiOutlinePlusCircle} label="Add Car" active={adminClickedOption === "addcar"} onClick={() => handleOptionClick("addcar")} />
              <NavItem icon={HiOutlineLibrary} label="My Fleet" active={adminClickedOption === "ownedcars"} onClick={() => handleOptionClick("ownedcars")} />
              <NavItem icon={HiOutlineClipboardList} label="Requests" active={adminClickedOption === "OwnerBookingDetails"} onClick={() => handleOptionClick("OwnerBookingDetails")} />
              <SectionHeader>Preferences</SectionHeader>
              <NavItem icon={HiOutlineCog} label="Settings" active={adminClickedOption === "Deletecarowner"} onClick={() => handleOptionClick("Deletecarowner")} />
            </>
          )}

          {userRole === "user" && (
            <>
              <SectionHeader>User Account</SectionHeader>
              <NavItem icon={HiOutlineUserCircle} label="Profile" active={adminClickedOption === "profile"} onClick={() => handleOptionClick("profile")} />
              <NavItem icon={HiOutlineBookOpen} label="My Bookings" active={adminClickedOption === "booking"} onClick={() => handleOptionClick("booking")} />
              <SectionHeader>Preferences</SectionHeader>
              <NavItem icon={HiOutlineCog} label="Settings" active={adminClickedOption === "Delete User"} onClick={() => handleOptionClick("Delete User")} />
            </>
          )}
        </ul>
      </div>

      {/* User Session Section */}
      <div className={`mt-auto pt-8 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
        {!isCollapsed ? (
          <div className="relative group mb-6 px-1">
            <div className="relative flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-surface-800 to-surface-900 border border-white/5 flex items-center justify-center text-primary-400 shrink-0">
                <HiOutlineUserCircle size={22} />
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-white text-xs font-black truncate">{user?.fullname || "Guest User"}</p>
                <p className="text-surface-500 text-[8px] uppercase font-black tracking-widest">{user?.role || "Visitor"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 mb-6">
            <HiOutlineUserCircle size={22} />
          </div>
        )}

        <div className="flex items-center gap-2 w-full">
          <button
            onClick={handleLogOut}
            className={`group flex items-center gap-3 transition-all ${isCollapsed
              ? "w-full aspect-square justify-center rounded-xl bg-red-500/10 text-red-100 hover:bg-red-500"
              : "flex-1 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
              }`}
          >
            <HiOutlineLogout className="text-lg group-hover:rotate-12 transition-transform shrink-0" />
            {!isCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>}
          </button>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-3 rounded-xl bg-white/5 text-surface-500 hover:text-white transition-colors"
            >
              <HiChevronLeft size={18} />
            </button>
          )}
        </div>
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="mt-2 w-full aspect-square flex items-center justify-center rounded-xl bg-white/5 text-surface-500 hover:text-white transition-colors"
          >
            <HiMenuAlt2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

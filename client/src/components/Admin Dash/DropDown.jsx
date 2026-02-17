import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClickedOption } from "../../redux/adminSlice";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Dropdown = ({ title, items, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clickedOption = useSelector((state) => state.admin.clickedOption);

  const toggleDropdown = () => {
    if (isCollapsed) return;
    setIsOpen(!isOpen);
  };

  const handleItemClick = (label) => {
    dispatch(setClickedOption(label));
    navigate("/admindash");
  };

  return (
    <li className="list-none">
      <motion.div
        whileHover={{ x: isCollapsed ? 0 : 5 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all ${isOpen && !isCollapsed ? "bg-white/10 text-white" : "text-surface-400 hover:bg-white/5 hover:text-white"
          } ${isCollapsed ? "justify-center px-0" : ""}`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-3">
          <span className={`font-medium text-sm tracking-wide ${isCollapsed ? "shrink-0" : ""}`}>{title}</span>
        </div>
        {!isCollapsed && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-surface-500"
          >
            <HiChevronDown size={20} />
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden ml-4 pl-4 border-l border-white/10 mt-2 space-y-1"
          >
            {items.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ x: 4 }}
                className={`p-2.5 rounded-xl cursor-pointer text-sm transition-all ${clickedOption === item.label
                  ? "text-primary-400 font-bold bg-primary-500/5"
                  : "text-surface-500 hover:text-surface-200"
                  }`}
                onClick={() => handleItemClick(item.label)}
              >
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default Dropdown;

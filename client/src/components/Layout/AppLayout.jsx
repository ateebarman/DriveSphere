import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import { motion } from "framer-motion";

const AppLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-surface-950 overflow-hidden">
            {/* Sidebar Container */}
            <motion.div
                animate={{ width: isCollapsed ? "90px" : "300px" }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="hidden lg:block h-full bg-surface-900 border-r border-white/5 overflow-hidden shrink-0"
            >
                <Sidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />
            </motion.div>

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen overflow-y-auto overflow-x-auto thin-scrollbar relative bg-surface-950 min-w-0">
                <div className="min-w-full px-6 py-4 lg:px-10 lg:py-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;

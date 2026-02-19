import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt2, HiChevronLeft } from "react-icons/hi";

const AppLayout = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-surface-950 overflow-hidden">
            {/* Mobile Top Bar */}
            <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-surface-900 border-b border-white/5 z-[60]">
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 cursor-pointer group"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                        D
                    </div>
                    <span className="text-white font-display font-bold tracking-tight">DriveSphere</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <HiMenuAlt2 size={24} />
                </button>
            </div>

            {/* Desktop Sidebar Container */}
            <motion.div
                initial={false}
                animate={{ width: isCollapsed ? "90px" : "300px" }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="hidden lg:block h-full bg-surface-900 border-r border-white/5 overflow-hidden shrink-0"
            >
                <Sidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />
            </motion.div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm z-[70] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-surface-900 z-[80] lg:hidden shadow-2xl"
                        >
                            <div className="h-full relative">
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="absolute top-6 right-6 p-2 text-surface-400 hover:text-white transition-colors"
                                >
                                    <HiChevronLeft size={24} className="rotate-180" />
                                </button>
                                <Sidebar
                                    isCollapsed={false}
                                    setIsCollapsed={() => { }}
                                    onOptionClick={() => setIsMobileMenuOpen(false)}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden thin-scrollbar relative bg-surface-950">
                <div className="min-w-full px-4 lg:px-10 py-6 lg:py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;

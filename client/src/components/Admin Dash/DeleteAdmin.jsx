import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import { API_END_POINT_CarOwner } from "../../utils/constants";

const DeleteAdmin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const deleteAccount = async () => {
        const confirmDelete = window.confirm("CRITICAL: Are you sure you want to terminate your administrative session and scrub this account? This cannot be undone.");

        if (!confirmDelete) return;

        setLoading(true);
        try {
            await axios.delete(`${API_END_POINT_CarOwner}/deletecarowner`, {
                withCredentials: true,
            });

            toast.success("Account successfully purged from system.");
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Purge sequence failure.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center animate-in zoom-in-95 duration-500">
            <div className="w-full max-w-xl p-1 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-rose-600/30 blur-3xl opacity-40 animate-pulse" />

                <div className="relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-premium">
                    <div className="mb-10 text-center">
                        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] flex items-center justify-center text-red-400 mx-auto mb-8 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-display font-black text-white tracking-tight uppercase">Terminal Deactivation</h1>
                        <p className="text-surface-500 mt-4 font-medium italic">You are about to initiate a full registry purge of your administrative credentials.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 mb-10">
                        <p className="text-xs text-red-500/80 font-bold uppercase tracking-[0.15em] text-center leading-relaxed">
                            ⚠️ This action is final. All associated assets, records, and access tokens will be permanently scrubbed.
                        </p>
                    </div>

                    <button
                        onClick={deleteAccount}
                        disabled={loading}
                        className={`group relative w-full overflow-hidden rounded-2xl p-6 font-black uppercase tracking-[0.3em] text-sm transition-all duration-500 ${loading
                                ? "bg-surface-800 text-surface-600 cursor-not-allowed border border-white/5"
                                : "bg-red-500 text-white hover:bg-red-600 shadow-premium active:scale-[0.98]"
                            }`}
                    >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : "Confirm Deactivation"}
                        </div>
                    </button>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-[10px] font-black text-surface-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Abort sequence and return
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default DeleteAdmin;

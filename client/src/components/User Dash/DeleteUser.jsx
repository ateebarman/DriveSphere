import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import { API_END_POINT } from "../../utils/constants";
import { HiOutlineExclamation, HiOutlineShieldExclamation, HiOutlineUserRemove } from "react-icons/hi";

const DeleteUser = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const deleteAccount = async () => {
        const isConfirmed = window.confirm("CRITICAL WARNING: This will permanently erase your entire identity and history from the DriveSphere registry. This action cannot be undone. Proceed?");
        if (!isConfirmed) return;

        setLoading(true);
        try {
            await axios.delete(`${API_END_POINT}/deleteAccount`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            toast.success("Identity purged from global registry");
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Purge sequence failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-full max-w-2xl relative p-1">
                {/* Warning Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-3xl opacity-30" />

                <div className="relative bg-surface-900/50 backdrop-blur-3xl border border-red-500/10 rounded-[3rem] p-12 md:p-16 overflow-hidden shadow-premium">
                    <div className="flex flex-col items-center text-center">

                        {/* Warning Icon Hub */}
                        <div className="relative mb-10">
                            <div className="absolute -inset-4 bg-red-500/10 rounded-full blur-xl animate-pulse" />
                            <div className="relative w-24 h-24 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-inner">
                                <HiOutlineShieldExclamation size={48} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight mb-4">Termination Protocol</h2>

                        <div className="space-y-6 mb-12">
                            <p className="text-surface-400 font-medium leading-relaxed italic">
                                You are about to initiate a permanent account deletion sequence. This will result in the immediate and irreversible loss of:
                            </p>

                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                {[
                                    "Rental History & Invoices",
                                    "Verified Loyalty Status",
                                    "Active Platform Credentials",
                                    "Stored Preferences & Fleet Tags"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <HiOutlineExclamation className="text-red-500/50 shrink-0" size={16} />
                                        <span className="text-[10px] font-black text-surface-500 uppercase tracking-widest">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="w-full space-y-4">
                            <button
                                onClick={deleteAccount}
                                disabled={loading}
                                className="w-full py-5 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <HiOutlineUserRemove size={18} />
                                        Purge All My Information
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => navigate(-1)}
                                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
                                disabled={loading}
                            >
                                Abort Protocol
                            </button>
                        </div>

                        <p className="mt-10 text-[9px] text-red-500/40 uppercase font-black tracking-[0.3em] font-mono">
                            Identity Erasure Code: 1109-RED-ACT-00
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteUser;
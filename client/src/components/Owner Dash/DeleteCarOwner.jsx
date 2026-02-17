import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import { API_END_POINT_CarOwner } from "../../utils/constants";
import { motion } from "framer-motion";
import { HiOutlineExclamation, HiOutlineShieldExclamation, HiOutlineTrash } from "react-icons/hi";

const DeleteCarOwner = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const deleteAccount = async () => {
        const confirmDelete = window.confirm("Initiate account deletion sequence? This action is irreversible.");

        if (!confirmDelete) return;

        setLoading(true);
        try {
            await axios.delete(`${API_END_POINT_CarOwner}/deletecarowner`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            toast.success("Account data purged from network.");
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            toast.error("Security override failure: Unable to delete account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full bg-surface-900/50 backdrop-blur-3xl border border-red-500/10 rounded-[3rem] p-12 shadow-premium text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-8 border border-red-500/20">
                    <HiOutlineShieldExclamation size={40} />
                </div>

                <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight mb-4">
                    Critical Authorization Required
                </h2>

                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 text-red-400 mb-2 justify-center">
                        <HiOutlineExclamation size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Irreversible Action</span>
                    </div>
                    <p className="text-surface-400 text-sm leading-relaxed">
                        You are about to initiate the permanent deletion of your car owner account and all associated fleet data. This process cannot be undone.
                    </p>
                </div>

                <button
                    onClick={deleteAccount}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] group"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <HiOutlineTrash size={18} className="group-hover:rotate-12 transition-transform" />
                            Purge Account Data
                        </>
                    )}
                </button>

                <p className="text-[10px] text-surface-600 uppercase tracking-[0.2em] mt-8 font-black">
                    System ID: DS-GLOBAL-OVERRIDE
                </p>
            </motion.div>
        </div>
    );
};

export default DeleteCarOwner;

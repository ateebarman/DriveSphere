import React, { useState } from "react";
import toast from "react-hot-toast";
import { API_END_POINT_CarOwner } from "../../utils/constants";
import axios from "axios";

const DeleteCars = () => {
  const [regNumber, setRegNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle car deletion
  const handleDeleteCar = async (e) => {
    e.preventDefault();

    if (!regNumber) {
      toast.error("Please enter a registration number.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`${API_END_POINT_CarOwner}/deletecar`, {
        headers: { "Content-Type": "application/json" },
        data: { regNumber: regNumber },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Vehicle purged from inventory successfully");
        setRegNumber("");
      }
    } catch (error) {
      console.error("Error deleting the car:", error);
      toast.error(error.response?.data?.message || "Purge failed. Verify reg number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-in zoom-in-95 duration-500">
      <div className="w-full max-w-xl p-1 relative">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-primary-500/20 blur-2xl opacity-50" />

        <div className="relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-premium">
          <div className="mb-10 text-center">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-400 mx-auto mb-6 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">Purge Vehicle</h2>
            <p className="text-surface-500 mt-2 font-medium italic">Enter the registration number to remove asset.</p>
          </div>

          <form onSubmit={handleDeleteCar} className="space-y-8">
            <div className="space-y-3">
              <label
                htmlFor="regNumber"
                className="block text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] ml-2"
              >
                Asset Registration ID
              </label>
              <input
                type="text"
                id="regNumber"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full p-5 rounded-2xl bg-surface-800 border border-white/5 text-white placeholder-surface-600 focus:outline-none focus:border-red-500/50 transition-all font-mono tracking-widest uppercase"
                placeholder="E.G. DS-EV-001"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full overflow-hidden rounded-2xl p-5 font-black uppercase tracking-[0.2em] text-sm transition-all duration-500 ${loading
                  ? "bg-surface-800 text-surface-600 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600 shadow-premium"
                }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : "Execute Purge"}
              </div>
            </button>
          </form>

          <div className="mt-10 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">⚠️ This action is permanent and cannot be reversed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCars;

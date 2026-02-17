import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_END_POINT_admin } from '../../utils/constants';

const DeleteUser = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteUser = async () => {
    if (!email) {
      toast.error("Subject email required for termination");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`${API_END_POINT_admin}/deleteuser`, {
        data: { email },
        withCredentials: true,
      });

      toast.success(response.data.message || "Account terminated successfully");
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Termination sequence failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-in zoom-in-95 duration-500">
      <div className="w-full max-w-xl p-1 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-orange-600/30 blur-2xl opacity-40 animate-pulse" />

        <div className="relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-premium">
          <div className="mb-10 text-center">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-400 mx-auto mb-6 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
              </svg>
            </div>
            <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">Terminal Termination</h2>
            <p className="text-surface-500 mt-2 font-medium italic">De-authorize and remove personnel from standard registry.</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label
                htmlFor="user-email"
                className="block text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] ml-2"
              >
                Subject Email Address
              </label>
              <input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="target-subject@drivesphere.com"
                className="w-full p-5 rounded-2xl bg-surface-800 border border-white/5 text-white placeholder-surface-600 focus:outline-none focus:border-red-500/50 transition-all"
                required
              />
            </div>

            <button
              onClick={handleDeleteUser}
              disabled={loading}
              className={`group relative w-full overflow-hidden rounded-2xl p-5 font-black uppercase tracking-[0.2em] text-sm transition-all duration-500 ${loading
                  ? "bg-surface-800 text-surface-600 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600 shadow-premium"
                }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Terminate Account
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="mt-10 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-center">
            <p className="text-[10px] text-red-400/60 font-bold uppercase tracking-widest">⚠️ Critical Alert: This will irreversibly scrub all subject records.</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DeleteUser;
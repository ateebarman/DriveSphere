import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_END_POINT_admin } from '../../utils/constants';

const GetUser = () => {
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetUser = async () => {
    if (!email) {
      toast.error("Digital identification required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_END_POINT_admin}/getuser`, {
        params: { email },
        withCredentials: true,
      });

      setUserData(response.data);
      toast.success("Subject data retrieved");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching user');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-12 animate-in fade-in duration-700">
      <div className="w-full max-w-2xl p-1 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-violet-500/20 blur-3xl opacity-50" />

        <div className="relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-premium">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">User Registry Access</h2>
            <p className="text-surface-500 mt-2 font-medium italic">Query the central database for subject intelligence.</p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="subject@drivesphere.com"
                className="w-full p-5 rounded-2xl bg-surface-800 border border-white/5 text-white placeholder-surface-600 focus:outline-none focus:border-primary-500/50 transition-all"
                required
              />
            </div>
            <button
              onClick={handleGetUser}
              disabled={loading}
              className="px-8 rounded-2xl bg-primary-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-primary-600 transition-all shadow-premium disabled:opacity-50"
            >
              {loading ? "querying..." : "Retrieve"}
            </button>
          </div>
        </div>
      </div>

      {userData && (
        <div className="w-full max-w-2xl animate-in slide-in-from-top-8 duration-500">
          <div className="bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-premium">
            <div className="bg-gradient-to-r from-primary-600/20 to-violet-600/20 p-8 border-b border-white/5 flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-surface-800 border border-white/10 flex items-center justify-center text-3xl font-black text-primary-400 shadow-inner">
                {userData.fullname?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">{userData.fullname || 'Anonymous Entity'}</h3>
                <p className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                  Verified Registry Entry
                </p>
              </div>
            </div>

            <div className="p-8 grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] text-surface-500 font-black uppercase tracking-widest">Digital Contact</p>
                <p className="text-white font-medium">{userData.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-surface-500 font-black uppercase tracking-widest">Authority Role</p>
                <span className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                  {userData.role}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-surface-500 font-black uppercase tracking-widest">Member Since</p>
                <p className="text-white font-medium">Standard 2024</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-surface-500 font-black uppercase tracking-widest">Status Code</p>
                <p className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">Active Clearance</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default GetUser;
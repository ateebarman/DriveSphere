import React, { useEffect, useState } from "react";
import { API_END_POINT } from "../../utils/constants";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_END_POINT}/profile`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setUserData(res.data);
        setName(res.data.fullname);
      } catch (error) {
        toast.error("Registry lookup failed");
        console.error("Error response:", error.response);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Identity verification requires a name");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${API_END_POINT}/update`,
        { fullname: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUserData(res.data);
      setIsEditing(false);
      toast.success("Identity records updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Data update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
      <div className="w-full max-w-4xl p-1 relative">
        {/* Decorative Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-3xl opacity-50" />

        <div className="relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] overflow-hidden shadow-premium">
          <div className="grid grid-cols-1 lg:grid-cols-5 h-full">

            {/* Left Sidebar Info */}
            <div className="lg:col-span-2 bg-white/[0.02] border-r border-white/5 p-12 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-surface-800 to-surface-700 border border-white/10 flex items-center justify-center text-5xl font-black text-primary-400 shadow-inner mb-6">
                  {userData?.fullname?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>

              <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                {userData?.fullname || "Verified Member"}
              </h3>
              <p className="text-primary-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 mb-8">
                Active Tier Status
              </p>

              <div className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <p className="text-[10px] text-surface-500 font-black uppercase tracking-widest">Digital Identifier</p>
                <p className="text-sm font-medium text-surface-200 truncate">{userData?.email}</p>
              </div>
            </div>

            {/* Right Form Area */}
            <div className="lg:col-span-3 p-12 lg:p-16">
              <div className="mb-10">
                <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight mb-2">Registry Profile</h2>
                <p className="text-surface-500 font-medium italic">Manage your personnel data and platform credentials.</p>
              </div>

              {userData ? (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-5 rounded-2xl bg-surface-800 border border-white/10 text-white placeholder-surface-600 focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                          placeholder="Personnel Name"
                        />
                      ) : (
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-surface-100 font-bold">
                          {userData.fullname}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] ml-1">Correspondence Address</label>
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-white/40 font-mono text-sm">
                        {userData.email}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    {isEditing ? (
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setName(userData.fullname);
                          }}
                          className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                        >
                          Abort
                        </button>
                        <button
                          onClick={handleUpdate}
                          disabled={loading}
                          className="flex-[2] py-4 rounded-2xl bg-primary-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-premium hover:bg-primary-600 transition-all flex items-center justify-center"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : "Sync Changes"}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full py-5 rounded-2xl bg-primary-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-premium hover:bg-primary-600 transition-all transform active:scale-[0.98]"
                      >
                        Modify Identity Records
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-pulse">
                  <div className="h-16 bg-white/5 rounded-2xl w-full" />
                  <div className="h-16 bg-white/5 rounded-2xl w-full" />
                  <div className="h-16 bg-white/5 rounded-2xl w-1/2" />
                </div>
              )}

              <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Enhanced Security Active</p>
                    <p className="text-[9px] text-surface-500 font-medium uppercase tracking-wider mt-1">Your session is protected by end-to-end platform encryption.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
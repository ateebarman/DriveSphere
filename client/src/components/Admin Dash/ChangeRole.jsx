import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_END_POINT_admin } from '../../utils/constants';

const ChangeRole = () => {
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCurrentRole = async () => {
    if (!email) {
      toast.error('Email is required to verify identity');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_END_POINT_admin}/getuser`, {
        params: { email },
        withCredentials: true,
      });

      if (response.data && response.data.role) {
        setCurrentRole(response.data.role);
        toast.success('Subject identity verified');
      } else {
        toast.error('User not found in registry');
        setCurrentRole('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failure');
      setCurrentRole('');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async () => {
    if (!email || !newRole) {
      toast.error('Identity and new authorization level required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_END_POINT_admin}/change-role`,
        { email, newRole },
        { withCredentials: true }
      );

      toast.success(response.data.message || 'Authorization updated');
      await fetchCurrentRole();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Access modification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-2xl p-1 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 blur-3xl opacity-50" />

        <div className="relative bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-premium">
          <div className="mb-12 text-center">
            <div className="w-20 h-20 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 mx-auto mb-6 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">Privilege Escalation</h2>
            <p className="text-surface-500 mt-2 font-medium italic">Modify subject access levels across the platform.</p>
          </div>

          <div className="space-y-10">
            {/* Email Input */}
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] ml-2">Digital Identification (Email)</label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@drivesphere.com"
                  className="flex-1 p-5 rounded-2xl bg-surface-800 border border-white/5 text-white placeholder-surface-600 focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                />
                <button
                  onClick={fetchCurrentRole}
                  disabled={loading}
                  className="px-6 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                  title="Verify Identity"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Status Display */}
            {currentRole && (
              <div className="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 flex items-center justify-between">
                <span className="text-[10px] font-black text-surface-500 uppercase tracking-widest">Active Authorization</span>
                <span className="px-4 py-2 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20 text-[10px] font-black uppercase tracking-widest">
                  {currentRole}
                </span>
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] ml-2">Assigned Authority Level</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-5 rounded-2xl bg-surface-800 border border-white/5 text-white focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-surface-900">Configure Access Level</option>
                <option value="user" className="bg-surface-900 text-white">Regular User (Subject)</option>
                <option value="carOwner" className="bg-surface-900 text-white">Asset Operator (Owner)</option>
                <option value="admin" className="bg-surface-900 text-white">System Administrator (Root)</option>
              </select>
            </div>

            <button
              onClick={handleChangeRole}
              disabled={loading || !newRole}
              className={`group relative w-full overflow-hidden rounded-2xl p-5 font-black uppercase tracking-[0.2em] text-sm transition-all duration-500 ${loading || !newRole
                ? "bg-surface-800 text-surface-600 cursor-not-allowed border border-white/5"
                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-premium"
                }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Apply New Privileges
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRole;
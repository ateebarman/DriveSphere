import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_END_POINT_admin } from "../../utils/constants";
import Pagination from "../Common/Pagination";
import Skeleton from "../Common/Skeleton";

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_END_POINT_admin}/getallusers?page=${page}&limit=10&search=${search}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(currentPage, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">Authority Management</h2>
          <p className="text-surface-500 mt-1 font-medium italic">Overview of all active accounts and administrative privileges.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-500/20 to-primary-500/20 blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-2xl" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Filter by name, email or access role..."
          className="relative w-full p-4 pl-6 rounded-2xl bg-surface-900/50 border border-white/10 text-white placeholder-surface-500 focus:outline-none focus:border-accent-500/50 transition-all backdrop-blur-xl shadow-inner"
        />
      </div>

      {/* User Table */}
      <div className="bg-surface-900/50 rounded-[2.5rem] border border-white/5 shadow-premium overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] uppercase font-black tracking-[0.2em] text-surface-500 border-b border-white/5">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Digital Address</th>
                <th className="px-8 py-6 text-center">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-2xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-4 w-48" />
                    </td>
                    <td className="px-8 py-6 flex justify-center">
                      <Skeleton className="h-8 w-24 rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-surface-800 to-surface-700 border border-white/10 flex items-center justify-center text-primary-400 font-bold shadow-inner">
                          {user.fullname?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold group-hover:text-primary-400 transition-colors uppercase tracking-tight">{user.fullname || "Anonymous Entity"}</p>
                          <p className="text-[10px] text-surface-600 uppercase tracking-widest font-black">Member Since 2024</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-surface-400 font-medium lowercase tracking-wide selection:bg-primary-500/30">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <RolePill role={user.role} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-20">
                    <p className="text-surface-600 font-bold uppercase tracking-widest text-xs">No personnel matched your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

const RolePill = ({ role }) => {
  const styles = {
    admin: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    carOwner: "bg-green-500/10 text-green-400 border-green-500/20",
    default: "bg-surface-800/50 text-surface-400 border-white/5"
  };

  const currentStyle = styles[role] || styles.default;

  return (
    <span className={`inline-block px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${currentStyle} backdrop-blur-md`}>
      {role}
    </span>
  );
};

export default GetAllUsers;

import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_END_POINT } from "../../utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearchCircle } from "react-icons/hi";
import Pagination from "../Common/Pagination";
import Skeleton from "../Common/Skeleton";

const CardContainer = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const itemsPerPage = 12;

  const { location, startDate, dropDate } = useSelector((state) => state.car);
  const filters = useSelector((state) => state.filter);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters or location change
  }, [location, filters, startDate, dropDate]);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: itemsPerPage,
          location: location || "",
          brand: filters.filter?.brand?.join(",") || "",
          type: filters.filter?.type?.join(",") || "",
          transmission: filters.filter?.transmission?.join(",") || "",
          fuelType: filters.filter?.fuelType?.join(",") || "",
          startDate: startDate || "",
          endDate: dropDate || ""
        });

        const res = await axios.get(`${API_END_POINT}/allcars?${queryParams.toString()}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        setCars(res.data.cars || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCars(res.data.totalCars || 0);
      } catch (error) {
        console.error("Error fetching cars", error);
        setError("Failed to fetch cars. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [location, filters, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 min-h-screen">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
          <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase">
            Available In <span className="text-primary-400">{location || "Central Hub"}</span>
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
        </div>
        <p className="text-center text-surface-500 font-medium italic tracking-wide">
          Intelligence report: {totalCars} premium assets matching criteria
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface-900/40 border border-white/5 rounded-[3rem] p-8 flex flex-col h-[520px]">
              <Skeleton className="h-56 w-full rounded-3xl mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="mt-auto flex justify-between items-center gap-4 pt-8">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-14 flex-1 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto bg-accent-500/10 border border-accent-500/20 p-8 rounded-[2rem] text-center">
          <p className="text-accent-400 font-black uppercase tracking-widest text-sm mb-2">System Error</p>
          <p className="text-surface-400 text-sm font-medium">{error}</p>
        </div>
      ) : cars.length > 0 ? (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {cars.map((car) => (
                <Card key={car._id} car={car} />
              ))}
            </AnimatePresence>
          </motion.div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[500px] text-center glass-card rounded-[3rem] border-white/5 p-12"
        >
          <div className="w-24 h-24 bg-primary-500/10 border border-primary-500/20 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
            <HiOutlineSearchCircle size={48} className="text-primary-400" />
          </div>
          <h3 className="text-2xl font-display font-black text-white mb-4 uppercase tracking-tight">Zero Matches Found</h3>
          <p className="text-surface-500 max-w-sm font-medium italic mb-8">
            The registry is clear for those specific parameters in {location}. Try broader intelligence criteria.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
          >
            Re-scan Database
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CardContainer;
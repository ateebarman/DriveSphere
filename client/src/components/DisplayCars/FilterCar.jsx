import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../redux/filterSlice';
import { motion } from 'framer-motion';
import { HiOutlineFilter, HiChevronRight } from 'react-icons/hi';

const FilterCar = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    brand: [],
    type: [],
    transmission: [],
    fuelType: [],
    price: 0,
    mileage: ''
  });

  const handleCheckboxChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilter = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value];

      return { ...prevFilters, [filterType]: updatedFilter };
    });
  };

  React.useEffect(() => {
    dispatch(setFilter(filters));
  }, [filters, dispatch]);

  const FilterGroup = ({ title, options, filterType, icon: Icon }) => (
    <div className="flex-1 min-w-[180px]">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="text-primary-500 text-sm" />
        <h4 className="text-[9px] font-black text-surface-500 uppercase tracking-[0.2em]">
          {title}
        </h4>
      </div>
      <div className="relative group/select">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isActive = filters[filterType].includes(option);
            return (
              <button
                key={option}
                onClick={() => handleCheckboxChange(filterType, option)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all duration-300 ${isActive
                  ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20"
                  : "bg-white/5 border-white/5 text-surface-400 hover:border-white/10 hover:text-white"
                  }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-900/50 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-premium"
    >
      <div className="flex flex-wrap justify-between items-start gap-10">
        <div className="flex flex-wrap flex-1 gap-8">
          <FilterGroup
            title="Manufacturer"
            filterType="brand"
            icon={HiChevronRight}
            options={["Tesla", "BMW", "Audi", "Mercedes", "Porsche", "Toyota", "Lamborghini", "Ferrari", "Rolls Royce", "Land Rover"]}
          />

          <FilterGroup
            title="Architecture"
            filterType="type"
            icon={HiChevronRight}
            options={["sedan", "suv", "hatchback"]}
          />

          <FilterGroup
            title="Drive System"
            filterType="transmission"
            icon={HiChevronRight}
            options={["manual", "automatic"]}
          />

          <FilterGroup
            title="Energy"
            filterType="fuelType"
            icon={HiChevronRight}
            options={["petrol", "diesel", "electric"]}
          />
        </div>

        <div className="lg:pl-8 lg:border-l border-white/5 h-full flex flex-col justify-end">
          <button
            onClick={() => setFilters({
              brand: [],
              type: [],
              transmission: [],
              fuelType: [],
              price: 0,
              mileage: ''
            })}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-surface-500 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all active:scale-[0.95]"
          >
            Reset Intelligence
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterCar;

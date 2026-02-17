import CardContainer from './CardContainer'
import FilterCar from "./FilterCar"
import Modify from './Modify'
import { motion } from "framer-motion"

const DisplayCars = () => {
  return (
    <div className="min-h-full">
      <div className="flex flex-col gap-8 px-6 py-2 lg:px-10 lg:py-4 max-w-[1400px] mx-auto">
        {/* Top Section: Modification & Filtering */}
        <section className="space-y-6">
          <Modify />
          <FilterCar />
        </section>

        {/* Main Content: Car Grid */}
        <main className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <CardContainer />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default DisplayCars;

import React, { useState } from 'react';
import { HiPhotograph } from "react-icons/hi";

const CarImageSlider = ({ car, height = "200px" }) => {
  // Assuming car.images is an array of image URLs
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to go to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length
    );
  };

  const [imgErrors, setImgErrors] = useState({});

  const handleImageError = () => {
    setImgErrors(prev => ({ ...prev, [currentImageIndex]: true }));
  };

  const currentImage = car.images && car.images.length > 0 ? car.images[currentImageIndex] : null;

  return (
    <div className="relative w-full">
      {/* Image Display */}
      {!currentImage || imgErrors[currentImageIndex] ? (
        <div
          style={{ height }}
          className="w-full bg-surface-800 rounded-lg mb-4 flex flex-col items-center justify-center border border-white/5"
        >
          <HiPhotograph className="text-surface-500 text-4xl mb-2" />
          <span className="text-surface-500 text-xs font-bold uppercase tracking-widest">Image Unavailable</span>
        </div>
      ) : (
        <img
          src={currentImage.startsWith('http') ? currentImage : `https://car-rental-ufci.onrender.com${currentImage}`}
          alt={`${car.brand} ${car.model}`}
          onError={handleImageError}
          style={{ height }} // Dynamically apply height
          className="w-full object-cover rounded-lg mb-4"
        />
      )}

      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 transform -translate-y-1/2  hover:bg-gray-200 px-2 pb-1 shadow-md rounded-full transition duration-300 ease-in-out text-xl font-extrabold"
      >
        &#8592;
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 transform -translate-y-1/2    hover:bg-gray-200 px-2 pb-1 shadow-md rounded-full transition duration-300 ease-in-out text-xl font-extrabold"
      >
        &#8594;
      </button>

      {/* Optional: Indicator dots for the carousel */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {car.images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2.5 h-2.5 rounded-full ${currentImageIndex === index ? 'bg-blue-600' : 'bg-gray-400'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarImageSlider;

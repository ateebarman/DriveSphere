import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_END_POINT_booking } from '../utils/constants';

const AvailableCars = () => {
  const [availableCars, setAvailableCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchAvailableCars = async () => {
      try {
        const response = await axios.get(`${API_END_POINT_booking}/availablecars`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      
        setAvailableCars(response.data);
      } catch (err) {
        setError('Failed to fetch available cars');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCars();
  }, []);

  const handleBook = (car) => {
    navigate("/bookingpage", { state: { car } });
  };

  if (loading) return <p>Loading available cars...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {availableCars.map((car) => (
        <div key={car._id} className="bg-white rounded-lg shadow-lg p-4">
          <img src={car.images} alt={car.model} className="w-full h-48 object-cover rounded-t-lg" />
          <h3 className="text-lg font-semibold mt-2">{car.model}</h3>
          <p className="text-gray-600">Status: {car.status}</p>
          <p className="text-gray-800">Price: Rs {car.rentalPricePerDay} per hour</p>
          <button
            onClick={() => handleBook(car)} // Pass the entire car object
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book
          </button>
        </div>
      ))}
    </div>
  );
};

export default AvailableCars;
import React, { useEffect, useState } from 'react';
import { API_END_POINT } from "../utils/constants";
import axios from 'axios';

const UserProfile = () => {
  const [userData, setUserData] = useState(null); // State for user data
  const [error, setError] = useState(''); // State for errors

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_END_POINT}/profile`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Send cookies along with the request
        });

        setUserData(res.data); // Save the user data to state
      } catch (error) {
        setError('Error fetching user information');
        console.error("Error response:", error.response);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-6">User Information</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {userData ? (
          <div>
            <h3 className="text-xl font-medium">User Details</h3>
            <p className="mt-2"><strong>Name:</strong> {userData.fullname}</p>
            <p className="mt-2"><strong>Email:</strong> {userData.email}</p>
            {/* Add more user fields as needed */}
          </div>
        ) : (
          <p>Loading...</p> // Display a loading message while data is being fetched
        )}
      </div>
    </div>
  );
  
};

export default UserProfile;

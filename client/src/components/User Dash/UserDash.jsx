import Sidebar from '../Sidebar';

import UserProfile from './UserProfile';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import UserBookingDetails from './UserBookingDetails';
import DeleteUser from './DeleteUser';
import MainPage from './MainPage';


const UserDash = () => {
  const clickedUserOption = useSelector((state) => state.admin.clickedOption) || "profile";

  const renderContent = () => {
    switch (clickedUserOption) {
      case 'dashboard':
        return <MainPage />;
      case "profile":
        return <UserProfile />;
      case 'booking':
        return <UserBookingDetails />;
      case 'Delete User':
        return <DeleteUser />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default UserDash;

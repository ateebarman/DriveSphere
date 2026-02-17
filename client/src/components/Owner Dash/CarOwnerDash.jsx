import { useSelector } from 'react-redux'
import Sidebar from '../Sidebar'
import AddCar from './AddCar';
import OwnedCars from './OwnedCars';
import OwnerBookingDetails from './OwnerBookingDetails';
import DeleteCarOwner from './DeleteCarOwner';
import RevenueReport from '../RevenueReport';
import UserProfile from '../User Dash/UserProfile';

const CarOwnerDash = () => {
  const clickedOwnerOption = useSelector((state) => state.admin.clickedOption) || "dashboard";

  const renderclickedOwnerOption = () => {
    switch (clickedOwnerOption) {
      case "dashboard":
        return <RevenueReport />;
      case "addcar":
        return <AddCar />;
      case "OwnerBookingDetails":
        return <OwnerBookingDetails />;
      case "ownedcars":
        return <OwnedCars />;
      case "Deletecarowner":
        return <DeleteCarOwner />;
      case "profile":
        return <UserProfile />;
      default:
        return <RevenueReport />;
    }
  };

  return (
    <div className="w-full">
      {renderclickedOwnerOption()}
    </div>
  );
};

export default CarOwnerDash

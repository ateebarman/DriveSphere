import Sidebar from '../Sidebar';
import { useSelector } from 'react-redux';

import GetAllCars from '../GetAllCars';
import AddCar from '../Owner Dash/AddCar';
import GetAllUsers from './GetAllUsers';
import ChangeRole from './ChangeRole';
import DeleteUser from './DeleteUser';
import GetUser from './GetUser';

import AdminBookings from './AdminBookings';
import AdminReport from './AdminReport';
import DeleteCars from './DeleteCars';
// import DeleteCarOwner from '../Owner Dash/DeleteCarOwner';
import DeleteAdmin from './DeleteAdmin';


const AdminDash = () => {
  const clickedOption = useSelector(state => state.admin.clickedOption);
  console.log(">>>", clickedOption);


  const renderContent = () => {
    switch (clickedOption) {
      case 'View All Cars':
        return <GetAllCars />;
      case 'Add New Car':
        return <AddCar />;
      case 'Delete car':
        return <DeleteCars />;
      case 'View All Users':
        return <GetAllUsers />;
      case 'Get User':
        return <GetUser />;
      case 'Change User Role':
        return <ChangeRole />;
      case 'Delete User':
        return <DeleteUser />;
      case 'View All Bookings':
        return <AdminBookings />;
      case 'Deactive Account':
        return <DeleteAdmin />;
      default:
        return <AdminReport />;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default AdminDash;

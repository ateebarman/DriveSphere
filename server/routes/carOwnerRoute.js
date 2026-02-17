import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import checkRoleMiddleware from "../middlewares/checkRoleMiddleware.js";
import { addCar, CarOwnerBookingDetails, deleteCar, getAllOwnedCars, getOwnedCar, updateCarDetails, deletecarownerbooking, deletecarowner, recentBookings, uploadimages, handleImagesUpload ,cancelBooking, updateCar} from "../controllers/carOwnerController.js";


const router = express.Router();


//adminController.js
router.get("/getownedcar", authMiddleware,checkRoleMiddleware(["carOwner"]), getOwnedCar);
router.get("/getallownedcars", authMiddleware,checkRoleMiddleware(["carOwner"]), getAllOwnedCars);
router.post("/addcar", authMiddleware,checkRoleMiddleware(["carOwner"]), uploadimages, addCar);
router.get("/CarOwnerBookingDetails", authMiddleware,checkRoleMiddleware(["carOwner"]), CarOwnerBookingDetails);
router.get("/recent-bookings", authMiddleware,checkRoleMiddleware(["carOwner"]), recentBookings);
// router.post("/uploadimages", authMiddleware,checkRoleMiddleware(["carOwner"]), uploadimages, handleImagesUpload);
router.delete("/deletecar", authMiddleware,checkRoleMiddleware(["carOwner", "admin"]), deleteCar);
router.put("/updatecardetails", authMiddleware,checkRoleMiddleware(["carOwner"]), updateCarDetails);
router.delete("/deletecarownerbooking/:bookingId", authMiddleware,checkRoleMiddleware(["carOwner", "admin"]), deletecarownerbooking);
router.delete("/deletecarowner", authMiddleware,checkRoleMiddleware(["carOwner", "admin"]), deletecarowner);
router.patch("/canceluserbooking/:id", authMiddleware,checkRoleMiddleware(["carOwner", "admin"]), cancelBooking);
router.put("/editcar/:carId", authMiddleware,checkRoleMiddleware(["carOwner"]), updateCar);

// router.post("/deletcarowner", authMiddleware,checkRoleMiddleware(["carOwner"]), deletcarowner);



export default router;
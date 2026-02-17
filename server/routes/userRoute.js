import express from "express"
import { Login, Logout, Register } from "../controllers/authController.js";
import { deleteUserAccount, getUserProfile, updatePassword, updateUserProfile, UserBookingDetails, deleteuserbooking, getAllCars, cancelBooking} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

//authController.js
router.post("/register", Register);
router.post("/login", Login);
router.get("/logout",Logout);

//usrController.js
router.get("/profile", authMiddleware, getUserProfile);
router.get("/userbookingdetails", authMiddleware, UserBookingDetails);

// router.get("/userbookingdetails", authMiddleware, async (req, res, next) => {
//   try {
//     throw new Error("Test Error from /complete");
//   } catch (error) {
//     next(error);
//   }
// });



router.put("/update", authMiddleware, updateUserProfile);
router.delete("/deleteuserbooking/:bookingId", authMiddleware,deleteuserbooking);
router.put("/updatePassword", authMiddleware, updatePassword);
router.post("/deleteAccount", authMiddleware, deleteUserAccount);
router.get("/allcars", getAllCars);
router.patch("/canceluserbooking/:id", authMiddleware, cancelBooking);

export default router;
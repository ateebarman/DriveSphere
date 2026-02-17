import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
// import checkRoleMiddleware from "../middlewares/checkRoleMiddleware.js";
import { booked, getAvailableCars, verifyBookingStatus, verifyPayment } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/booked", authMiddleware, booked);
router.get("/availablecars", getAvailableCars);
router.get("/status/:id", verifyBookingStatus);
router.get("/verify/:id", verifyPayment); // Manual verification route




export default router;
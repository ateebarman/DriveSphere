import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the cookies
    const token = req.cookies.token;
    

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided Here.",
        success: false,
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);

    // Attach the user data to the request object
    req.user = user;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({
      message: "Invalid token. Access denied.",
      success: false,
    });
  }
};

import { User } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

// Password Validation Regex
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/;

// Sign-Up (Register)
export const Register = async (req, res) => {
  try {
    const { fullname, email, password, mobileNo, role } = req.body;

    if (!fullname || !email || !password || !role || !mobileNo) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }
    // password validation
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message:
          "Password must have atleast 4 characters, atleast one digit, one lowercase, and one uppercase letter.",
        success: false,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        message: "User with this email already exists.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      mobileNo,
      role,
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
      token,
      data: newUser,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      message: "Internal Server Error. Please try again later.",
      success: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const decoded = jwt.decode(token);
    const tokenExpiry = decoded.exp;

    const isDev = process.env.NODE_ENV !== "production";

    return res
      .status(200)
      .cookie("token", token, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production", // set secure only in production
        // // sameSite: "Strict",
        // maxAge: 3600000, // 1 hour
        httpOnly: true,
        secure: true, // required for cross-origin on HTTPS
        sameSite: "None", // required for cross-origin
        maxAge: 3600000,
        // httpOnly: true,
        // secure: !isDev,          // only secure in production
        // sameSite: isDev ? "Lax" : "None", // "Lax" works locally without HTTPS
        // maxAge: 3600000,
      })
      .json({
        message: `Welcome back, ${user.fullname}!`,
        success: true,
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          token: token,
          tokenExpiry: tokenExpiry,
        },
      });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      message: "Internal Server Error. Please try again later.",
      success: false,
    });
  }
};

// Logout
export const Logout = (req, res) => {
  return res
    .status(200)
    .cookie("token", "", { expires: new Date(0), httpOnly: true })
    .json({
      message: "User logged out successfully.",
      success: true,
    });
};

import { Booking } from "../models/bookingModel.js";
import { Car } from "../models/carModel.js";
import { User } from "../models/UserModel.js";
import { redisClient } from "../app.js";

// Manage Users:

//Get all users
export const getAllUsers = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;

    if (limit === 'all') {
      const users = await User.find().select("-password").sort({ createdAt: -1 });
      return res.json({ users, totalUsers: users.length });
    }

    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const skip = (p - 1) * l;
    const search = req.query.search || "";

    const query = {};
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } }
      ];
    }

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(l)
      .sort({ createdAt: -1 });

    res.json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getUser: Fetch a user by email
export const getUser = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Send the user data as response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Unable to fetch the user" });
  }
};

// Update a user role
export const changeUserRole = async (req, res) => {
  try {
    const { email, newRole } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User does not exist" });
    }

    user.role = newRole;
    await user.save();

    // Invalidate Cache for User Lists
    const keys = await redisClient.keys("admin_users_*");
    if (keys.length > 0) await redisClient.del(...keys);

    res.status(200).json({ message: "User role has changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// deleteUser(userId): Remove a user from the platform.
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const del = await Booking.deleteMany({ user: user._id });

    console.log(del);

    await User.findByIdAndDelete(user._id);

    // Invalidate Cache for User Lists
    const keys = await redisClient.keys("admin_users_*");
    if (keys.length > 0) await redisClient.del(...keys);

    res.status(200).json({ message: "User has been deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manage Cars:
// getAllCars(): Fetch details of all cars listed on the platform.
export const getAllCars = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;

    if (limit === 'all') {
      const cars = await Car.find().populate("ownerId", "fullname email").sort({ createdAt: -1 });
      return res.status(200).json({ cars, totalCars: cars.length });
    }

    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const skip = (p - 1) * l;
    const search = req.query.search || "";

    const query = {};
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { regNumber: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { fuelType: { $regex: search, $options: "i" } }
      ];
    }

    const totalCars = await Car.countDocuments(query);
    const cars = await Car.find(query)
      .populate("ownerId", "fullname email")
      .skip(skip)
      .limit(l)
      .sort({ createdAt: -1 });

    res.status(200).json({
      cars,
      totalCars,
      totalPages: Math.ceil(totalCars / l),
      currentPage: p
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getCar with particular registration Number
export const getCar = async (req, res) => {
  try {
    const { regNumber } = req.body;

    if (!regNumber) {
      return res
        .status(400)
        .json({ message: "Registration number is required." });
    }

    const car = await Car.findOne({ regNumber });

    if (!car) {
      return res
        .status(200)
        .json({ message: "No car with this registration No. listed." });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Unable to fetch car." });
  }
};

// Add a new car to the platform
export const addCar = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      regNumber,
      type,
      color,
      rentalPricePerDay,
      fuelType,
      transmission,
      seats,
      status,
      mileage,
      description,
      images,
      currentLocation,
    } = req.body;

    const ownerId = req.user._id;

    const isCarExist = await Car.findOne({ regNumber });
    if (isCarExist) {
      return res
        .status(400)
        .json({ message: "Car with this registration number already exists" });
    }

    const newCar = new Car({
      brand,
      model,
      year,
      regNumber,
      type,
      color,
      rentalPricePerDay,
      fuelType,
      transmission,
      seats,
      status,
      mileage,
      description,
      images,
      currentLocation,
      ownerId,
    });

    await newCar.save();

    // Invalidate Cache for Car Lists
    const keys = await redisClient.keys("cars_query_*");
    if (keys.length > 0) await redisClient.del(...keys);

    return res.status(201).json({
      message: "Car added successfully",
      car: newCar,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add car" });
  }
};

// deleteCar(carId): Remove a car from the platform.
export const deleteCar = async (req, res) => {
  try {
    const { regNumber } = req.body;

    if (!regNumber) {
      return res
        .status(400)
        .json({ message: "Registration number is required." });
    }

    const deletedCar = await Car.deleteOne({ regNumber });

    if (deletedCar.deletedCount === 0) {
      //deleteCount = tells count of deleted entries
      return res.status(404).json({ message: "Car not found." });
    }

    // Invalidate Cache for Car Listings
    const keys = await redisClient.keys("cars_query_*");
    if (keys.length > 0) await redisClient.del(...keys);

    res.status(200).json({ message: "Car has been deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Unable to delete the car." });
  }
};

// Get all bookings:
// export const getAllBookings = async (req, res) => {
//   try {
//     let bookings = null;
//     const key = "bookings";
//     const value = await redisClient.get(key);

//     if (value) {
//       // bookings = JSON.parse(value);
//       bookings = value;
//       console.log("cache hit");
//     } else {
//       bookings = await Booking.find({})
//         .populate("user", "fullname email")
//         .populate("car", "brand model regNumber");
//       await redisClient.set(key, JSON.stringify(bookings), { ex: 1 });
//     }

//     // const bookings = await Booking.find({});

//     res.status(200).json(bookings);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Server error. Unable to fetch bookings." });
//   }
// };

export const getAllBookings = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;

    if (limit === 'all') {
      const bookings = await Booking.find({})
        .populate("user", "fullname email")
        .populate("car", "brand model regNumber")
        .sort({ createdAt: -1 });
      return res.status(200).json({ bookings, totalBookings: bookings.length });
    }

    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const skip = (p - 1) * l;
    const search = req.query.search || "";

    const query = {};
    if (search) {
      query.$or = [
        { "rentalLocation.pickupLocation": { $regex: search, $options: "i" } },
        { "rentalLocation.dropoffLocation": { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } }
      ];
    }

    let bookingsData = null;
    const key = `admin_bookings_p${p}_l${l}_s${search}`;

    try {
      const value = await redisClient.get(key);
      if (value) {
        bookingsData = typeof value === 'string' ? JSON.parse(value) : value;
        console.log("Cache hit");
      }
    } catch (err) {
      console.error("Redis GET error:", err);
    }

    if (!bookingsData) {
      const totalBookings = await Booking.countDocuments(query);
      const bookings = await Booking.find(query)
        .populate("user", "fullname email")
        .populate("car", "brand model regNumber")
        .skip(skip)
        .limit(l)
        .sort({ createdAt: -1 });

      bookingsData = {
        bookings,
        totalBookings,
        totalPages: Math.ceil(totalBookings / l),
        currentPage: p
      };

      try {
        await redisClient.set(key, JSON.stringify(bookingsData), { ex: 60 });
      } catch (err) {
        console.error("Redis SET error:", err);
      }
    }

    res.status(200).json(bookingsData);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error. Unable to fetch bookings." });
  }
};


export const recentBookings = async (req, res) => {
  try {
    // const CarOwnerId = req.user.id;

    // const cars = await Car.find({ ownerId: CarOwnerId });

    //   if (cars.length === 0) {
    //     return res.status(404).json({ message: "No cars found for this owner." });
    // }

    // const carIds = cars.map(car => car._id);

    const recentbookings = await Booking.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(5) // Limit to 5 bookings
      .populate("user", "fullname email")
      .populate("car", "brand model regNumber");

    if (recentbookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for these cars." });
    }

    res.status(200).json(recentbookings);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error. Unable to fetch booking details." });
  }
};

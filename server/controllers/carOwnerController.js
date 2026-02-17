import { Car } from "../models/carModel.js";
import { Booking } from "../models/bookingModel.js";
import { User } from "../models/UserModel.js"
import multer from "multer";
import path from "path";
import { redisClient } from "../app.js";

const regNumberValidation = /^(AP|AR|AS|BR|CH|DL|GA|GJ|HR|HP|JK|KA|KL|MH|MP|OD|PB|RJ|TN|UP|WB)\d{2}[A-Z]{2}\d{4}$/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject file
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: fileFilter,
});

// Create upload directory if it doesn't exist
import fs from "fs";
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}



// Manage Owned Cars:
// getOwnedCar(ownerId): Fetch car with reg. No. .
export const getOwnedCar = async (req, res) => {
  try {
    const { regNumber } = req.body; 
    const ownerId = req.user.id; 

    if (!regNumber) {
      return res.status(400).json({ message: "Registration number is required." });
    }

    const car = await Car.findOne({ regNumber, ownerId }); 

    if (!car) {
      return res.status(200).json({ message: "No car with this registraion No.." });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Unable to fetch cars." });
  }
};


//getOwnedCars - all the cars of owner
export const getAllOwnedCars = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const cacheKey = `owner_cars_${ownerId}_p${page}_l${limit}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json(typeof cached === 'string' ? JSON.parse(cached) : cached);
      }
    } catch (err) {
      console.error("Redis Error:", err);
    }

    const totalCars = await Car.countDocuments({ ownerId });
    const cars = await Car.find({ ownerId }).skip(skip).limit(limit).sort({ createdAt: -1 });

    const result = {
      message: 'Cars retrieved successfully',
      cars: cars || [],
      totalCars,
      totalPages: Math.ceil(totalCars / (limit || 9)),
      currentPage: page
    };

    try {
      await redisClient.set(cacheKey, JSON.stringify(result), { ex: 600 }); // 10 min cache
    } catch (err) {
      console.error("Redis SET Error:", err);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Unable to fetch cars." });
  }
};


// addCar(carDetails): Allow the owner to add new cars to the platform.
export const addCar = async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

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
      currentLocation,
    } = req.body;

    const ownerId = req.user?._id; 

    if (!regNumber) {
      return res.status(400).json({ message: 'Registration number is required' });
    }

    if(!regNumberValidation.test(regNumber)){
      return res.status(400).json({message:"Enter valid registration number",success: false})
      
    }

    const isCarExist = await Car.findOne({ regNumber });
    if (isCarExist) {
      return res.status(400).json({ message: 'Car with this registration number already exists' });
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
      images: imagePaths,
      currentLocation,
      ownerId,
    });


    await newCar.save();
    const ownerIdStr = ownerId.toString();

    // Invalidate Cache for Car Listings
    const keys = await redisClient.keys("cars_query_*");
    const ownerKeys = await redisClient.keys(`owner_cars_${ownerIdStr}_*`);
    if (keys.length > 0) await redisClient.del(...keys);
    if (ownerKeys.length > 0) await redisClient.del(...ownerKeys);

    return res.status(201).json({
      message: 'Car added successfully',
      car: newCar,
    });
  } catch (error) {
    console.error("Error while adding car:", error);

    // Add more detailed error message
    return res.status(500).json({
      message: 'Failed to add car',
      error: error.message,
    });
  }
};

// export const addCar = async (req, res) => {
//   try {
//     const newCar = new Car(req.body);
//     await newCar.save();
//     res.status(201).json({ success: true, message: 'Car added successfully' });
//   } catch (error) {
//     if (error.code === 11000) {
//       res.status(400).json({ success: false, message: 'Car with this registration number already exists' });
//     } else {
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   }
// };

export const CarOwnerBookingDetails = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `owner_bookings_${ownerId}_p${page}_l${limit}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json(typeof cached === 'string' ? JSON.parse(cached) : cached);
      }
    } catch (err) {
      console.error("Redis Error:", err);
    }

    const cars = await Car.find({ ownerId });
    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found for this owner." });
    }

    const carIds = cars.map(car => car._id);
    const totalBookings = await Booking.countDocuments({ car: { $in: carIds } });
    const bookings = await Booking.find({ car: { $in: carIds } })
      .populate('user', 'fullname email')
      .populate('car', 'brand model regNumber')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const result = {
      message: 'Bookings retrieved successfully',
      bookings: bookings || [],
      totalBookings,
      totalPages: Math.ceil(totalBookings / (limit || 10)),
      currentPage: page
    };

    try {
      await redisClient.set(cacheKey, JSON.stringify(result), { ex: 300 }); // 5 min cache
    } catch (err) {
      console.error("Redis SET Error:", err);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Unable to fetch booking details." });
  }
};

export const recentBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const cacheKey = `owner_recent_bookings_${ownerId}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json(typeof cached === 'string' ? JSON.parse(cached) : cached);
      }
    } catch (err) {
      console.error("Redis Error:", err);
    }

    const cars = await Car.find({ ownerId });
    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found for this owner." });
    }

    const carIds = cars.map(car => car._id);
    const recentbookings = await Booking.find({ car: { $in: carIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'fullname email')
      .populate('car', 'brand model regNumber');

    try {
      await redisClient.set(cacheKey, JSON.stringify(recentbookings), { ex: 300 }); // 5 min cache
    } catch (err) {
      console.error("Redis SET Error:", err);
    }

    res.status(200).json(recentbookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Unable to fetch booking details." });
  }
};

export const uploadimages = upload.array("images", 5);

export const handleImagesUpload = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Map over the files to create a file path array
    const filePaths = req.files.map(file => `/uploads/${file.filename}`);

    res.status(200).json({
      message: "Images uploaded successfully!",
      filePaths: filePaths, // Return all file paths
    });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};

// export const uploadimages = async (req, res) => {
//   try {
//     res.status(200).json({
//       message: "Image uploaded successfully!",
//       filePath: `/uploads/${req.file.filename}`,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Image upload failed", error });
//   }
// }


// removeCar(regNumber): Allow the owner to remove cars from the platform.
export const deleteCar = async (req, res) => {
  try {
    const { regNumber } = req.body;
    // console.log(regNumber);

    if (!regNumber) {
      return res.status(400).json({ message: "Registration number is required." });
    }

    const deletedCar = await Car.deleteOne({ regNumber });

    if (deletedCar.deletedCount === 0) { //deleteCount = tells count of deleted entries
      return res.status(404).json({ message: "Car not found." });
    }

    const deletedBookings = await Booking.deleteMany({ regNumber: regNumber });
    const ownerIdStr = req.user.id.toString();

    // Invalidate Cache
    const keys = await redisClient.keys("cars_query_*");
    const ownerKeys = await redisClient.keys(`owner_cars_${ownerIdStr}_*`);
    if (keys.length > 0) await redisClient.del(...keys);
    if (ownerKeys.length > 0) await redisClient.del(...ownerKeys);

    res.status(200).json({
      message: `Car and ${deletedBookings.deletedCount} associated bookings have been deleted successfully.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Unable to delete the car." });
  }
};


// updateCarDetails(carId, updatedDetails): Edit details of cars owned by the owner.
export const updateCarDetails = async (req, res) => {
  const { regNumber } = req.body;
  try {
    const car = await Car.findOne({ regNumber });
    if (!car) {
      return res.status(404).json({ message: "Car not found with this registration number." });
    }

    // Use Object.assign to update only provided fields
    Object.assign(car, req.body);

    const updatedCar = await car.save(); // Save updated car details

    // Invalidate Cache for Car Listings
    const keys = await redisClient.keys("cars_query_*");
    if (keys.length > 0) await redisClient.del(...keys);

    res.status(200).json({
      message: "Car details updated successfully",
      car: updatedCar
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error. Unable to update car details." });
  }
};


export const deletecarownerbooking = async (req, res) => {
  try {
      const { bookingId } = req.params;

      const deletedBooking = await Booking.findByIdAndDelete(bookingId);

      if (!deletedBooking) {
          return res.status(404).json({ message: "Booking not found." });
      }

    // After deleting the booking, we don't need to manually update car status
    // as availability is now calculated dynamically from active bookings.
    res.status(200).json({ message: "Booking deleted successfully." });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error. Unable to delete booking." });
  }
};


export const deletecarowner = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find the user by ID
    const user = await User.findById(ownerId);
    console.log(user);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find all cars associated with the car owner
    const cars = await Car.find({ ownerId : ownerId });

    if (cars.length > 0) {
      // Extract car IDs
      const carIds = cars.map(car => car._id);

      // Delete all bookings related to the owner's cars
      await Booking.deleteMany({ car: { $in: carIds } });

      // Delete all cars owned by the user
      await Car.deleteMany({ ownerId : ownerId });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(ownerId);

    // Clear cookie and send response
    res.clearCookie('token');
    return res.status(200).json({ message: "Car owner, cars, and related bookings deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error deleting user: ${err.message}`);
  }
};

export const cancelBooking = async (req, res) => {
  const { id } = req.params; // Get booking ID from params

  try {
      // Find the booking by ID
      const booking = await Booking.findById(id).populate('car'); // Populate car to get its details
      console.log(id);

      if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
      }

      // Authorization Check
      if (req.user.role === 'carOwner') {
          // Ensure the car belongs to the logged-in owner
          if (booking.car.ownerId.toString() !== req.user.id) {
              return res.status(403).json({ message: "Unauthorized to cancel this booking" });
          }
      }

      // Check if the booking is already cancelled
      if (booking.status === "cancelled") {
          return res.status(400).json({ message: "Booking is already cancelled" });
      }

      // Update the status of the booking to "cancelled"
      booking.status = "cancelled";
      await booking.save();

      // Invalidate Cache
      const carKeys = await redisClient.keys("cars_query_*");
      const ownerIdStr = req.user.id.toString();
      const ownerKeys = await redisClient.keys(`owner_bookings_${ownerIdStr}_*`);
      const recentKeys = await redisClient.keys(`owner_recent_bookings_${ownerIdStr}`);
      
      if (booking.user) {
        const userKeys = await redisClient.keys(`user_bookings_${booking.user.toString()}_*`);
        if (userKeys.length > 0) await redisClient.del(...userKeys);
      }

      if (carKeys.length > 0) await redisClient.del(...carKeys);
      if (ownerKeys.length > 0) await redisClient.del(...ownerKeys);
      if (recentKeys.length > 0) await redisClient.del(...recentKeys);

      return res.status(200).json({
          message: "Booking cancelled successfully",
          booking,
      });
  } catch (error) {
      console.error("Error canceling booking:", error);
      return res.status(500).json({
          message: "Internal server error while canceling the booking",
      });
  }
};

export const updateCar = async (req, res) => {
  const carId = req.params.carId;
  // console.log(carId);
  const {
    brand,
    model,
    year,
    type,
    color,
    seats,
    mileage,
    rentalPricePerDay,
    status, // Add status in the request body
  } = req.body;

  try {
    // Validate if the request body contains all the required fields
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ message: "Invalid input data", errors: errors.array() });
    // }

    // Find the car by ID and check if it belongs to the logged-in user (owner)
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Ensure the car is owned by the logged-in user
    // if (car.ownerId.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "You are not authorized to edit this car" });
    // }

    // Update the car details if provided
    car.brand = brand || car.brand;
    car.model = model || car.model;
    car.year = year || car.year;
    car.type = type || car.type;
    car.color = color || car.color;
    car.seats = seats || car.seats;
    car.mileage = mileage || car.mileage;
    car.rentalPricePerDay = rentalPricePerDay || car.rentalPricePerDay;

    // Update the car status if provided
    if (status) {
      if (["active", "maintenance", "retired"].includes(status)) {
        car.status = status;
      } else {
        return res.status(400).json({ message: "Invalid status value. Use: active, maintenance, retired" });
      }
    }

    // Save the updated car details to the database
    await car.save();

    // Invalidate Cache for Car Listings
    const keys = await redisClient.keys("cars_query_*");
    if (keys.length > 0) await redisClient.del(...keys);

    // Send a success response with updated car details
    return res.status(200).json({ message: "Car details updated successfully", car });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Could not update car details" });
  }
};

// Handle Bookings for Owned Cars:
// getBookingsForCars(ownerId): Fetch bookings made for the cars owned by the owner.
// approveBooking(bookingId): Approve a pending booking (if needed).
// declineBooking(bookingId): Decline a booking request.
// View Revenue:
// getOwnerRevenue(ownerId): View revenue generated from the cars owned by the owner.
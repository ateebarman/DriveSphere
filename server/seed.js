import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./models/UserModel.js";
import { Car } from "./models/carModel.js";
import { Booking } from "./models/bookingModel.js";
import { connectToDatabase } from "./app.js";

dotenv.config();

const SEED_PASSWORD = "1234@Ateeb";
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad"];
const HUB_LOCATIONS = {
  Mumbai: ["Mumbai Airport", "Bandra Kurla Complex", "Nariman Point", "Andheri East"],
  Delhi: ["Delhi Terminal 3", "Connaught Place", "Gurgaon CyberHub", "Noida Sector 18"],
  Bangalore: ["Kempegowda Airport", "Koramangala", "Indiranagar", "Electronic City"],
  Chennai: ["Chennai Central", "OMR IT Corridor", "Adyar", "Anna Nagar"],
  Kolkata: ["Howrah Station", "Salt Lake Sector V", "Park Street", "New Town"],
  Hyderabad: ["Gachibowli", "HITEC City", "Banjara Hills", "Secunderabad"],
};

const CAR_TEMPLATES = [
  { brand: "Tesla", model: "Model S Plaid", type: "sedan", fuel: "electric", price: 18000, seats: 5, images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200"] },
  { brand: "BMW", model: "M4 Competition", type: "sedan", fuel: "petrol", price: 22000, seats: 4, images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200"] },
  { brand: "Audi", model: "RS e-tron GT", type: "sedan", fuel: "electric", price: 25000, seats: 4, images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200"] },
  { brand: "Mercedes", model: "G63 AMG", type: "suv", fuel: "petrol", price: 35000, seats: 5, images: ["https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200"] },
  { brand: "Porsche", model: "911 Carrera", type: "sedan", fuel: "petrol", price: 28000, seats: 2, images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200"] },
  { brand: "Land Rover", model: "Defender 110", type: "suv", fuel: "diesel", price: 20000, seats: 7, images: ["https://images.unsplash.com/photo-1625299292534-70490ac61a3d?q=80&w=1200"] },
  { brand: "Lamborghini", model: "Urus", type: "suv", fuel: "petrol", price: 45000, seats: 5, images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1200"] },
  { brand: "Ferrari", model: "Roma", type: "sedan", fuel: "petrol", price: 50000, seats: 2, images: ["https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1200"] },
  { brand: "Rolls Royce", model: "Ghost", type: "sedan", fuel: "petrol", price: 85000, seats: 5, images: ["https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=1200"] },
  { brand: "Toyota", model: "Land Cruiser 300", type: "suv", fuel: "diesel", price: 15000, seats: 7, images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1200"] },
];

const seed = async () => {
  try {
    await connectToDatabase();
    console.log("Seeding new data while preserving existing records...");
    // await User.deleteMany({});
    // await Car.deleteMany({});
    // await Booking.deleteMany({});

    const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);

    const timestamp = Date.now();
    // 1. Create Admin
    console.log("Seeding Registry...");
    /* 
    const admin = await User.create({
      fullname: "Central Admin",
      email: "admin@drivesphere.com",
      password: hashedPassword,
      mobileNo: "9000000000",
      role: "admin",
    });
    */

    // 2. Create 20 Car Owners
    const owners = [];
    for (let i = 1; i <= 20; i++) {
      const owner = await User.create({
        fullname: `Fleet Owner ${i} (${timestamp})`,
        email: `owner${i}_${timestamp}@drivesphere.com`,
        password: hashedPassword,
        mobileNo: `91${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: "carOwner",
      });
      owners.push(owner);
    }

    // 3. Create 50 Normal Users
    const users = [];
    for (let i = 1; i <= 50; i++) {
      const user = await User.create({
        fullname: `Client ${i} (${timestamp})`,
        email: `user${i}_${timestamp}@drivesphere.com`,
        password: hashedPassword,
        mobileNo: `92${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: "user",
      });
      users.push(user);
    }

    // 4. Create 100 Cars
    console.log("Deploying Assets...");
    const cars = [];
    for (let i = 0; i < 100; i++) {
      const template = CAR_TEMPLATES[i % CAR_TEMPLATES.length];
      const city = CITIES[i % CITIES.length];
      const owner = owners[Math.floor(Math.random() * owners.length)];
      
      const car = await Car.create({
        ...template,
        regNumber: `DS-${city.substring(0,2).toUpperCase()}-${timestamp.toString().slice(-4)}${i}`,
        year: 2020 + Math.floor(Math.random() * 5),
        color: ["Obsidian Black", "Pearl White", "Titanium Silver", "guards Red"][Math.floor(Math.random() * 4)],
        rentalPricePerDay: template.price + (Math.floor(Math.random() * 5) * 1000),
        fuelType: template.fuel,
        transmission: "automatic",
        mileage: 10 + Math.floor(Math.random() * 15),
        description: `Premium ${template.brand} ${template.model} available for deployment in ${city}.`,
        currentLocation: city,
        ownerId: owner._id,
        status: i % 10 === 0 ? "maintenance" : "active",
      });
      cars.push(car);
    }

    // 5. Create 150 Bookings distributed over last 6 months
    console.log("Generating Mission History...");
    const now = new Date();
    const bookings = [];
    const statuses = ["completed", "completed", "confirmed", "confirmed", "cancelled"];

    for (let i = 0; i < 150; i++) {
        // ... (lines 116-129 unchanged) ...
      const car = cars[Math.floor(Math.random() * cars.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const city = car.currentLocation;
      const hubList = HUB_LOCATIONS[city];
      
      const dateOffset = Math.floor(Math.random() * 180); 
      const startDate = new Date();
      startDate.setDate(now.getDate() - dateOffset);
      
      const endDate = new Date(startDate);
      const duration = 1 + Math.floor(Math.random() * 5);
      endDate.setDate(startDate.getDate() + duration);

      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const booking = await Booking.create({
        user: user._id,
        car: car._id,
        regNumber: car.regNumber,
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        totalPrice: car.rentalPricePerDay * duration,
        priceSnapshot: car.rentalPricePerDay, // Added required field
        status: status,
        paymentStatus: status === "completed" || status === "confirmed" ? "paid" : status === "cancelled" ? "refunded" : "pending",
        paymentMethod: "credit_card",
        transactionId: (status === "completed" || status === "confirmed") ? `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,
        rentalLocation: {
          pickupLocation: hubList[Math.floor(Math.random() * hubList.length)],
          dropoffLocation: hubList[Math.floor(Math.random() * hubList.length)],
        },
      });
      
      // Removed: Legacy car status update
    }

    console.log(`
      ✅ Database Seeded Successfully!
      ---------------------------------
      Admins: 1
      Owners: 20
      Users:  50
      Assets: 100
      Missions: 150
      ---------------------------------
      System Status: READY
    `);
    process.exit(0);
  } catch (error) {
    console.error("Critical Failure in Seeding Sequence:", error);
    process.exit(1);
  }
};

seed();

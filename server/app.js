import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import carOwnerRoute from "./routes/carOwnerRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import Stripe from "stripe";
import errorHandler from "./middlewares/errorMiddleware.js";
import { authMiddleware as authenticate } from "./middlewares/authMiddleware.js";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
// import redis from "redis";
import { Redis } from "@upstash/redis";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Booking } from "./models/bookingModel.js";

// export const redisClient = redis.createClient({
//   url:'maximum-wolf-21246.upstash.io:6379'
// });

// (async () => {
//   redisClient.on("error", (err) => {
//     console.error("Redis client error", err);
//   });

//   redisClient.on("ready", () => {
//     console.error("Redis client started");
//   });

//   await redisClient.connect();
//   await redisClient.ping();

// })();

dotenv.config();

export const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv.config({ path: ".env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();


// Verify Stripe Webhook Signature (Must come before express.json parsing)
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata.bookingId;

      if (bookingId) {
        try {
          // Update booking status to confirmed and paymentStatus to paid
          await Booking.findByIdAndUpdate(bookingId, {
            status: "confirmed",
            paymentStatus: "paid",
            transactionId: session.payment_intent, // Save Stripe Payment Intent ID
          });
          console.log(`Booking ${bookingId} confirmed via webhook.`);
        } catch (error) {
          console.error(`Error updating booking ${bookingId}:`, error);
        }
      }
    }

    res.send();
  }
);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// CORS
// const corsOptions = {
//   origin: "http://localhost:5173",
//   credentials: true,
// };

// // app.use(cors(corsOptions));

// app.use(cors(corsOptions));

// const corsOptions = {
//   origin: [
//    'car-rental-git-vedant-vedant-nikams-projects.vercel.app',
//    'http://localhost:5173'  // Keep local development URL
//  ],
//  credentials: true,
// };
// app.use(cors(corsOptions));

const corsOptions = {
  origin: [
   process.env.FRONTEND_URL || 'http://localhost:5173',
   'https://drivesphere.vercel.app'
 ], 
 credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// const corsOptions = {
//   origin: true, // Reflects the request origin, which is safest for Swagger UI
//   credentials: true,
// };

// app.use(cors(corsOptions));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "DriveSphere",
      version: "1.0.0",
      description: "API documentation for DriveSphere API application",
      contact: {
        name: "Your Name",
        email: "your-email@example.com",
      },
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // security: [  // Apply security globally (so all routes require authentication by default)
    //     {
    //         BearerAuth: []
    //     }
    // ],
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:8000",
      },
    ],
  },
  apis: ["./swaggers/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(morgan("dev"));

// app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "Server is healthy" });
});

// Routes
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/carOwner", carOwnerRoute);
app.use("/api/booking", bookingRoute);

// Payment Checkout Route


// ... existing code ...

// Payment Checkout Route
// Use authenticate middleware to ensure user is logged in
// Payment Checkout Route
// Use authenticate middleware to ensure user is logged in
app.post("/api/checkout", authenticate, async (req, res, next) => {
  console.log("Checkout route hit!"); 
  console.log("Request body:", req.body);
  try {
    const { carName, totalPrice, bookingId } = req.body; // Expect bookingId from frontend

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: carName },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
          
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/completed?bookingId=${bookingId}`, // Frontend URL for redirection
      cancel_url: `${process.env.FRONTEND_URL}/cards`, // Frontend URL for cancellation
      metadata: {
        bookingId: bookingId, // Attach bookingId to Stripe Session metadata
      },
    });


    // Store Stripe Session ID for manual verification
    await Booking.findByIdAndUpdate(bookingId, {
      stripeSessionId: session.id,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout Error:", error);
    next(error); // Pass error to middleware
  }
});

// Default Route for Testing
app.get("/complete", (req, res) => {
  res.send("Payment Successful");
});

// Not Found Middleware (Handles undefined routes)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Use the Error Handling Middleware
app.use(errorHandler);

// Database Connection
export const connectToDatabase = async (MONGO_URI) => {
  try {
    const URI = MONGO_URI || process.env.MONGO_URL;
    await mongoose.connect(URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

export default app;

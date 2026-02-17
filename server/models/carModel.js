import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    regNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["sedan", "suv", "hatchback"],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    rentalPricePerDay: {
      type: Number,
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "retired"],
      default: "active",
    },
    mileage: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
    },
    currentLocation: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexing
carSchema.index({ brand: 1 });  
carSchema.index({ model: 1 });    
carSchema.index({ fuelType: 1 }); 
carSchema.index({ status: 1 });

// Text Index for broad search
carSchema.index({ 
  brand: 'text', 
  model: 'text', 
  regNumber: 'text', 
  type: 'text', 
  fuelType: 'text',
  color: 'text'
}, {
  weights: {
    brand: 10,
    model: 10,
    regNumber: 5,
    type: 2,
    fuelType: 1
  },
  name: "CarSearchIndex"
});

export const Car = mongoose.model("Car", carSchema);

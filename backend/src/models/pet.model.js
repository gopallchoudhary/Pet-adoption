const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String, // Cloudinary URL
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User Model
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [Longitude, Latitude]
        required: true,
      },
    },  
  },
  { timestamps: true }
);

// Indexing for Geolocation
petSchema.index({ location: "2dsphere" });

export const PetModel = mongoose.model("Pet", petSchema);

import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ownerSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true 
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },

});

//!password-hashing
OwnerSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isNew) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//! password-comparison
OwnerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//? access-token
OwnerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    "ownerAccessTokenSecret",
    { expiresIn: "1d" }
  );
};

//? refresh-token
OwnerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    "ownerRefreshTokenSecret",
    { expiresIn: "10d" }
  );
};

export const OwnerModel = mongoose.model("Owner", ownerSchema);
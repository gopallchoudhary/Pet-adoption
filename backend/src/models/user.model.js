
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

const userSchema = new Schema({
  name: {
    type: String,
    requuired: true,
    index: true,
    trim: true,
  },
  email: {
    type: String,
    requuired: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    requuired: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
  },
});

//!password-hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isNew) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//! password-comparison
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//? access-token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    "userAccessTokenSecret",
    { expiresIn: "1d" }
  );
};

//? refresh-token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    "userRefreshTokenSecret",
    { expiresIn: "10d" }
  );
};

export const UserModel = mongoose.model("User", userSchema);

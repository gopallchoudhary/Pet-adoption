import asyncHandler from "express-async-handler";
import {ApiError} from "../utils/ApirError.js";
import { UserModel } from "../models/user.model.js";


//.generateAccessTokenandRefreshToken
const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await UserModel.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      console.log("something went wrong");
    }
  };


//. signUp
const signUp = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  
    if (
      [firstName, lastName, email, password].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
  
    //! existed user
    const existedUser = await UserModel.findOne({ email });
    if (existedUser) {
      throw new ApiError(401, "User with email already exists");
    }
  
    //! create user
    try {
      const user = await UserModel.create({
        firstName,
        lastName,
        email,
        password,
      });
  
      //# created user
      const createdUser = await UserModel.findById(user._id).select(
        "-password -refreshToken"
      );
  
      if (!createdUser) {
        throw new ApiError(
          500,
          "Something went wrong while registering the user"
        );
      }
  
      return res.status(201).json({
        message: "User registered successfully",
      });
    } catch (error) {
      console.error(error);
      console.log("User creation failed");
    }
  });

  //. login
  const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    
    //! password-comparison
    if (!(await user.isPasswordCorrect(password))) {
      throw new ApiError(400, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    
    //! logged in user
    const loggedInUser = await UserModel.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)    
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "User logged in successfully",
      user: loggedInUser,
      accessToken,
      refreshToken,
    });
    
    
  });

  //.logout
  const logout = asyncHandler(async (req, res) => {
    const user = req.user;
  await UserModel.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      message: "User logged out",
    });
  })

export { signUp, login, logout };
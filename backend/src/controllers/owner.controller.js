
import asyncHandler from "express-async-handler";
import {ApiError} from "../utils/ApirError.js";
import { OwnerModel } from "../models/owner.model.js";

//.generateAccessTokenandRefreshToken
const generateAccessAndRefreshToken = async (ownerId) => {
    try {
      const owner = await OwnerModel.findById(ownerId);
      const accessToken = owner.generateAccessToken();
      const refreshToken = owner.generateRefreshToken();
      owner.refreshToken = refreshToken;
      await owner.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      console.log("something went wrong");
    }
  };


//. signUp
const signUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    if (
      [name, email, password].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
  
    //! existed owner
    const existedUser = await OwnerModel.findOne({ email });
    if (existedUser) {
      throw new ApiError(401, "User with email already exists");
    }
  
    //! create user
    try {
      const owner = await OwnerModel.create({
        name,
        email,
        password,
      });
  
      //# created user
      const createdOwner = await OwnerModel.findById(user._id).select(
        "-password -refreshToken"
      );
  
      if (!createdOwner) {
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
    const owner = await OwnerModel.findOne({ email });
    if (!owner) {
      throw new ApiError(404, "User not found");
    }
    
    //! password-comparison
    if (!(await owner.isPasswordCorrect(password))) {
      throw new ApiError(400, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(owner._id);
    
    //! logged in user
    const loggedInOwner = await OwnerModel.findById(owner._id).select(
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
      owner: loggedInOwner,
      accessToken,
      refreshToken,
    });
    
    
  });

  //. logout
  const logout = asyncHandler(async (req, res) => {
    const owner = req.owner;
  await OwnerModel.findByIdAndUpdate(
    owner._id,
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
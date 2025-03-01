import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApirError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const userAuthMiddleware = asyncHandler(async (req, res, next) => {
    try {
        //! token
        const token = req.cookies?.accessToken
        if(!token) {
            throw new ApiError(400, "Unauthorized request")
        }
    
        //! decoded token
        const decodedToken = jwt.verify(token, "userAccessTokenSecret")
    
        //!user
        const user = await UserModel.findById(decodedToken._id).select("-password -refreshToken")
        
    
        if(!user) {
            res.status(401)
            throw new Error("Invalid Access Token");
        }
    
        req.user = user
        next()
    } catch (error) {
        res.status(401)
        throw new Error(error.message || "Invalid access token");
    }
});
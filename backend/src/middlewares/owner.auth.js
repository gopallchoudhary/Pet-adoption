import { OwnerModel } from "../models/owner.model.js";
import { ApiError } from "../utils/ApirError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const ownerAuthMiddleware = asyncHandler(async (req, res, next) => {
    try {
        //! token
        const token = req.cookies?.accessToken
        if(!token) {
            throw new ApiError(400, "Unauthorized request")
        }
    
        //! decoded token
        const decodedToken = jwt.verify(token, "ownerAccessTokenSecret")
    
        //!user
        const owner = await OwnerModel.findById(decodedToken._id).select("-password -refreshToken")
        
    
        if(!owner) {
            res.status(401)
            throw new Error("Invalid Access Token");
        }
    
        req.owner = owner
        next()
    } catch (error) {
        res.status(401)
        throw new Error(error.message || "Invalid access token");
    }
}); 
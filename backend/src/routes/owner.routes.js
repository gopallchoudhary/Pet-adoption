import { Router } from "express";
const router = Router();

//! import controllers
import { signUp, login, logout } from "../controllers/owner.controller.js";

//! import middlewares  
import { ownerAuthMiddleware } from "../middlewares/owner.auth.js";


router.route("/signup").post(signUp);
router.route("/login").post(login); 
router.route("/logout").post(ownerAuthMiddleware, logout);

export default router;
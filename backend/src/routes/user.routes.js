import { Router } from "express";
const router = Router();

//! import controllers
import { signUp, login,  logout } from "../controllers/user.controller.js";

//! import middlewares
import { userAuthMiddleware } from "../middlewares/user.auth.js";


router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").get(userAuthMiddleware, logout);


export default router;
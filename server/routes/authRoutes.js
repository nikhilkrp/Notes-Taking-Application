import express from "express";
import { sendOTP, verifyOTP, googleAuth,getUser } from "../controllers/authController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google-auth", googleAuth);
router.get("/user", authMiddleware, getUser);

export default router;

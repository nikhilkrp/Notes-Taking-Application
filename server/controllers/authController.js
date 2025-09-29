import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// -------------------------------------------------- SEND OTP -----------------------------------------
export const sendOTP = async (req, res) => {
  try {
    const { email, name,dob } = req.body;
    if (!email ||!name) return res.status(400).json({ message: "All fields are required" });

    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otp);

  
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { name,dob,otp } },
      { new: true, upsert: true } 
    );
   

    // console.log("OTP saved in DB for", email, ":", user.otp);

    await sendEmail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("sendOTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ---------------- VERIFY OTP --------------
export const verifyOTP = async (req, res) => {
  try {
    const { email,otp,name } = req.body;

    if (!email || !otp || !name) {
      return res.status(400).json({ message: "Name, Email, and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

     if (user.name !== name) {
      return res.status(400).json({ message: "Name does not match" });
    }

    user.otp = null;
    await user.save();

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// //-------------------------------------------- Google OAuth login/signup
export const googleAuth = async (req, res) => {
  const { email, name, googleId } = req.body;
  if (!email || !googleId) return res.status(400).json({ message: "Invalid data" });

  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email, name, googleId });

  const token = generateToken(user._id);
  res.json({ token, user });
};



// get ------------------------user----------------------
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


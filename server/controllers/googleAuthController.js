import { OAuth2Client } from "google-auth-library";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body; 
    console.log("TOKEN FROM FRONTEND:", token);
    if (!token) return res.status(400).json({ message: "Google token missing" });

   
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
      
    });
    console.log("ENV CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    console.log("Google Payload:", payload);



    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, googleId });
    }


    const myToken = generateToken(user._id);

    res.json({ token: myToken, user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};

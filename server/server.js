import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import cors from "cors"
import googleAuthRoutes from "./routes/googleAuthRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://notes-taking-application-git-main-nikhils-projects-9dc5e1f8.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials:true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/auth", googleAuthRoutes);



const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));


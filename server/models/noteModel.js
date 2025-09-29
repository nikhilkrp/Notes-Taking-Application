import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Note", noteSchema);

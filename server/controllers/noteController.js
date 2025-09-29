import Note from "../models/noteModel.js";

export const createNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const note = await Note.create({ title, content, user: req.user._id });
  res.json(note);
};

export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
};

export const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json({ message: "Note deleted" });
};

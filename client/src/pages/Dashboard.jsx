import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const TrashIcon = ({ onClick }) => (
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-red-600 cursor-pointer transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [expanded, setExpanded] = useState(null);




  // Fetch logged in user
  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  // fetch notes 
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
    fetchNotes();
  }, []);

  // create note
  const handleCreate = async () => {
    if (!title) return alert("Title is required");
    try {
      const res = await API.post("/notes", { title, content });
      setNotes(prev => [res.data, ...prev]);
      setTitle("");
      setContent("");
      setShowCreate(false);
    } catch (err) {
      console.error(err);
    }
  };

  // delete note
  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const toggleNote = (id) => {
    setOpenNoteId(openNoteId === id ? null : id);
  };


  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 font-sans p-6 md:p-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4 space-y-5">

        <header className="flex items-center justify-between  pb-4 border-b border-gray-200">
          {/* header section 1 */}
          <div className="flex  items-center space-x-2">
            <SunIcon className="" />
            <h1 className="md:text-2xl text-[12px] font-bold  text-gray-800">Dashboard</h1>
          </div>
          <button onClick={signOut} className="md:text-lg text-[10px]  font-bold text-blue-600 hover:underline">
            Sign Out
          </button>
        </header>

        <div className="flex-flex-col items-center justify-center border-2 shadow-lg border-gray-300 rounded-lg p-4 space-y-4 mr-2">
          <h1 className="md:text-2xl font-bold break-words text-gray-800">Welcome, {user.name}</h1>
          <p className="md:text-md font-semibold break-words text-gray-500 ">Email: {user.email}</p>
        </div>

    
        <div className="my-6 mr-2">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-gradient-to-l from-blue-800 to-blue-500 text-white w-full p-2 mr-2 rounded-md hover:bg-blue-600 transition"
          >
            {showCreate ? "Cancel" : "Create Note"}
          </button>

          {showCreate && (
            <section className="my-6 flex  flex-col gap-5">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="md:text-lg text-md  border p-2 rounded-md shadow shadow-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <input
                type="text"
                placeholder="Content"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="md:text-lg text-md border p-2 rounded-md shadow shadow-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button onClick={handleCreate} className="bg-gradient-to-r from-blue-800 to-blue-500 text-white p-2 rounded-md">Add Note</button>
            </section>
          )}
        </div>


       
<section>
  <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Notes</h2>
  {notes.length === 0 ? (
    <p className="text-gray-500">No notes yet.</p>
  ) : (
    <div className="space-y-3">
      {notes.map(note => (
        <div
          key={note._id}
          className="flex justify-between items-start border p-3 rounded-md shadow-sm bg-gray-50 cursor-pointer"
          onClick={() =>
            setExpanded(expanded === note._id ? null : note._id)
          }
        >
          <div>
            <h3 className="font-semibold">{note.title}</h3>
            {expanded === note._id && (
              <p className="text-gray-600 mt-1">{note.content}</p>
            )}
          </div>
          <TrashIcon
            onClick={e => {
              e.stopPropagation(); 
              handleDelete(note._id);
            }}
          />
        </div>
      ))}
    </div>
  )}
</section>

      </div>
    </div>
  );
};

export default Dashboard;

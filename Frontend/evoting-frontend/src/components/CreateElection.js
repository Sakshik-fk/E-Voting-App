import { useState } from "react";
import axios from "../api/axiosConfig";

function CreateElection({ refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState("");

  const token = localStorage.getItem("token");

  const createElection = async () => {
    if (!title || !description || !endTime) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post(
        "/election/create",
        {
          title,
          description,
          endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setDescription("");
      setEndTime("");
      refresh(); // 🔁 keep your existing refresh workflow
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create election");
    }
  };

  return (
    <div className="card">
      <h3>Create Election</h3>
      
      <input
        placeholder="Election Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* ✅ Added field (required for timer & auto close) */}
      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      <button onClick={createElection}>Create</button>
    </div>
  );
}

export default CreateElection;

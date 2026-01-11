import { useState } from "react";
import axios from "../api/axiosConfig";

function CreateElection({ refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createElection = async () => {
    await axios.post("/election/create", {
      title,
      description
    });

    setTitle("");
    setDescription("");
    refresh();
  };

  return (
    <div className="card">
      <h3>Create Election</h3>

      <input
        placeholder="Election Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button onClick={createElection}>Create</button>
    </div>
  );
}

export default CreateElection;

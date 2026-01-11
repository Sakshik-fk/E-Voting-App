import { useState } from "react";
import axios from "../api/axiosConfig";

function AddCandidate({ electionId }) {
  const [name, setName] = useState("");

  const addCandidate = async () => {
    await axios.post("/candidate/add", {
      name,
      electionId
    });
    setName("");
    alert("Candidate Added");
  };

  return (
    <div>
      <input
        placeholder="Candidate Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={addCandidate}>Add Candidate</button>
    </div>
  );
}

export default AddCandidate;

import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosConfig";

function AddCandidate() {
  const { electionId } = useParams();
  const [name, setName] = useState("");
  const [candidates, setCandidates] = useState([]);

  const token = localStorage.getItem("token");

  // ✅ Fetch existing candidates
  const fetchCandidates = useCallback(async () => {
    try {
      const res = await axios.get(`/election/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(res.data);
    } catch (err) {
      console.error("Failed to load candidates", err);
    }
  }, [electionId, token]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const addCandidate = async () => {
    if (!name.trim()) {
      alert("Candidate name is required");
      return;
    }

    try {
      await axios.post(
        "/candidate/add",
        { name, electionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setName("");
      fetchCandidates(); // ✅ refresh list
      alert("Candidate Added");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add candidate");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Add Candidate</h3>

      <input
        placeholder="Candidate Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addCandidate} style={{ marginLeft: "10px" }}>
        Add Candidate
      </button>

      {/* ✅ EXISTING CANDIDATES */}
      <div style={{ marginTop: "20px" }}>
        <h4>Existing Candidates</h4>

        {candidates.length === 0 && <p>No candidates added yet</p>}

        {candidates.map((c, index) => (
          <p key={c._id}>
            {index + 1}. {c.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default AddCandidate;

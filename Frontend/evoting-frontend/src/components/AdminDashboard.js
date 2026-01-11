import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import LogoutButton from "./LogoutButton";

function AdminDashboard() {
  const [elections, setElections] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchElections = useCallback(async () => {
    try {
      const res = await axios.get("/election/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setElections(res.data);
    } catch (err) {
      console.error("Failed to fetch elections", err);
    }
  }, [token]);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const closeElection = async (id) => {
    try {
      await axios.put(`/election/close/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchElections();
    } catch {
      alert("Failed to close election");
    }
  };

  return (
    <div style={styles.container}>
      <LogoutButton />
      <h2>Admin Dashboard</h2>

      {elections.map(e => {
        const maxVotes = Math.max(...(e.candidates || []).map(c => c.votes), 0);
        const leaders = (e.candidates || []).filter(c => c.votes === maxVotes && maxVotes > 0);

        return (
          <div key={e._id} style={styles.card}>
            <h3>{e.title}</h3>
            <p>{e.description}</p>
            <p style={{ color: e.isActive ? "green" : "red", fontWeight: "bold" }}>
              {e.isActive ? "🟢 Active" : "🔴 Closed"}
            </p>

            {e.isActive && leaders.length > 0 && (
              <p>🏆 Leading: {leaders.map(l => l.name).join(", ")} ({maxVotes} votes)</p>
            )}

            {e.isActive && (
              <>
                <button onClick={() => navigate(`/candidates/${e._id}`)}>View Candidates</button>
                <button onClick={() => closeElection(e._id)}>Close Election</button>
              </>
            )}

            {!e.isActive && (
              <button onClick={() => navigate(`/admin/results/${e._id}`)}>
                View Results
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: { padding: "30px", background: "#f5f6fa", minHeight: "100vh" },
  card: { background: "#fff", padding: "15px", borderRadius: "8px", marginBottom: "15px" },
};

export default AdminDashboard;

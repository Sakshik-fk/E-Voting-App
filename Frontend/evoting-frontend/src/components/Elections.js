import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

function Elections() {
  const [elections, setElections] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const url = role === "admin" ? "/election/all" : "/election";

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setElections(res.data);
      } catch (err) {
        console.error("Failed to load elections", err);
      }
    };

    fetchElections();
  }, [role, token]);

  return (
    <div style={styles.container}>
      <LogoutButton />

      <h2 style={styles.heading}>
        {role === "admin" ? "Admin Dashboard" : "Elections"}
      </h2>

      {elections.length === 0 && <p>No elections found</p>}

      {elections.map(e => (
        <div key={e._id} style={styles.card}>
          <h3>{e.title}</h3>
          <p>{e.description}</p>

          <p style={{ fontWeight: "bold", color: e.isActive ? "green" : "red" }}>
            {e.isActive ? "🟢 Active" : "🔴 Closed"}
          </p>

          {/* VOTER */}
          {role === "voter" && e.isActive && (
            <button
              style={styles.button}
              onClick={() => navigate(`/candidates/${e._id}`)}
            >
              Vote
            </button>
          )}

          {/* RESULTS (Both admin & voter) */}
          {!e.isActive && (
            <button
              style={styles.buttonSecondary}
              onClick={() => navigate(`/results/${e._id}`)}
            >
              View Results
            </button>
          )}

          {/* ADMIN CLOSE */}
          {role === "admin" && e.isActive && (
            <button
              style={styles.closeButton}
              onClick={async () => {
                try {
                  await axios.put(`/election/close/${e._id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  alert("Election closed");
                  setElections(prev =>
                    prev.map(el =>
                      el._id === e._id ? { ...el, isActive: false } : el
                    )
                  );
                } catch {
                  alert("Failed to close election");
                }
              }}
            >
              Close Election
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial",
    backgroundColor: "#f5f6fa",
    minHeight: "100vh",
  },
  heading: {
    marginBottom: "20px",
  },
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  button: {
    marginRight: "10px",
    padding: "8px 12px",
    cursor: "pointer",
  },
  buttonSecondary: {
    padding: "8px 12px",
    cursor: "pointer",
  },
  closeButton: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Elections;

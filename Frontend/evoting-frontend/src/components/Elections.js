import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";


// ✅ ADDED
import CreateElection from "./CreateElection";
// import AddCandidate from "./AddCandidate";


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
  
const activeCount = elections.filter(e => e.isActive).length;
const closedCount = elections.filter(e => !e.isActive).length;

 return (
  <div style={styles.page}>
    <div style={styles.logoutWrapper}>
  <LogoutButton />
</div>


    <h2 style={styles.heading}>
      {role === "admin" ? "Admin Dashboard" : "Available Elections"}
    </h2>
{role === "admin" && (
  <div style={styles.statsRow}>
    <div style={{ ...styles.statBox, borderLeft: "6px solid #2ecc71" }}>
      <div style={styles.statIcon}>🟢</div>
      <div>
        <p style={styles.statLabel}>Active Elections</p>
        <h2 style={styles.statNumber}>{activeCount}</h2>
      </div>
    </div>

    <div style={{ ...styles.statBox, borderLeft: "6px solid #e74c3c" }}>
      <div style={styles.statIcon}>🔴</div>
      <div>
        <p style={styles.statLabel}>Closed Elections</p>
        <h2 style={styles.statNumber}>{closedCount}</h2>
      </div>
    </div>
  </div>
)}



    {role === "admin" && (
      <div style={styles.createBox}>
        <CreateElection refresh={() => window.location.reload()} />

      </div>
    )}

    {elections.length === 0 && <p>No elections found</p>}

    <div style={styles.grid}>
      {elections.map((e) => (
        <div key={e._id} style={styles.card}>
          <div style={styles.cardHeader}>
            <h3>{e.title}</h3>
            <span
              style={{
                ...styles.badge,
                backgroundColor: e.isActive ? "#2ecc71" : "#e74c3c",
              }}
            >
              {e.isActive ? "ACTIVE" : "CLOSED"}
            </span>
          </div>

          <p style={styles.desc}>{e.description}</p>

          <div style={styles.actions}>
            {role === "admin" && (
              <button
                style={styles.primary}
                onClick={() => navigate(`/add-candidate/${e._id}`)}
              >
                ➕ Add Candidate
              </button>
            )}

            {role === "voter" && e.isActive && (
              <button
                style={styles.primary}
                onClick={() => navigate(`/candidates/${e._id}`)}
              >
                Vote
              </button>
            )}

            {!e.isActive && (
              <button
                style={styles.secondary}
                onClick={() => navigate(`/results/${e._id}`)}
              >
                View Results
              </button>
            )}

            {role === "admin" && e.isActive && (
              <button
                style={styles.danger}
                onClick={async () => {
                  try {
                    await axios.put(
                      `/election/close/${e._id}`,
                      {},
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    setElections((prev) =>
                      prev.map((el) =>
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
        </div>
      ))}
    </div>
  </div>
);

}

const styles = {
  page: {
    padding: "30px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "Inter, Arial",
  },
  heading: {
    marginBottom: "20px",
  },
  createBox: {
  margin: "0 auto 40px auto",
  padding: "20px",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  maxWidth: "500px",
},

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  desc: {
    margin: "10px 0 20px",
    color: "#555",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  primary: {
    background: "#3498db",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  secondary: {
  background: "#9b59b6",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
},

  danger: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  
  logoutWrapper: {
  position: "absolute",
  top: "20px",
  right: "30px",
},


statsRow: {
  display: "flex",
  gap: "20px",
  marginBottom: "35px",
},


statBox: {
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: "15px",
  backgroundColor: "#ffffff",
  padding: "18px 22px",
  borderRadius: "12px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
},

statIcon: {
  fontSize: "28px",
},

statLabel: {
  margin: 0,
  fontSize: "14px",
  color: "#777",
},

statNumber: {
  margin: 0,
  fontSize: "28px",
  fontWeight: "bold",
}
};

export default Elections;

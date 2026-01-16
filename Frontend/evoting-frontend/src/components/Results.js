import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import LogoutButton from "./LogoutButton";
import Confetti from "react-confetti";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function Results() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const confettiPlayed = useRef(false);

  const calculateTimeLeft = useCallback((endTime) => {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return null;
    const hrs = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const mins = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
    const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  }, []);

  const fetchResults = useCallback(async () => {
    try {
      const electionRes = await axios.get(`/election/one/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const electionData = electionRes.data;
      setElection(electionData);
      if (role === "voter") setHasVoted(electionData.voters.includes(userId));

      if (electionData.isActive && electionData.endTime) {
        const tl = calculateTimeLeft(electionData.endTime);
        setTimeLeft(tl);
        if (!tl) {
          await axios.put(
            `/election/close/${electionId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          electionData.isActive = false;
          setElection({ ...electionData });
        }
      } else {
        setTimeLeft(null);
      }

      const candidatesRes = await axios.get(`/election/results/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(candidatesRes.data);

      if (!electionData.isActive && !confettiPlayed.current && candidatesRes.data.length > 0) {
        const maxVotes = Math.max(...candidatesRes.data.map((c) => c.votes), 0);
        if (maxVotes > 0) {
          setShowConfetti(true);
          confettiPlayed.current = true;
          setTimeout(() => setShowConfetti(false), 6000);
        }
      }
    } catch (err) {
      console.error("Failed to load results", err);
    }
  }, [electionId, token, role, userId, calculateTimeLeft]);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 3000);
    return () => clearInterval(interval);
  }, [fetchResults]);

  if (!election) return <p>Loading...</p>;

  const maxVotes = Math.max(...candidates.map((c) => c.votes), 0);
  const leaders = candidates.filter((c) => c.votes === maxVotes && maxVotes > 0);

  // Hover handler for all buttons
  const handleHover = (e, hover) => {
    if (hover) {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0px 4px 12px rgba(0,0,0,0.2)";
    } else {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "none";
    }
  };

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti recycle={false} />}
      <div style={styles.header}>
        <h2>{election.title}</h2>
        <LogoutButton />
      </div>
      <p style={styles.description}>{election.description}</p>

      <div style={styles.status}>
        {election.isActive ? (
          <span style={styles.active}>🟢 Voting Live</span>
        ) : (
          <span style={styles.closed}>🔴 Voting has ended</span>
        )}
        {election.isActive && timeLeft && (
          <span style={styles.timer}>⏱ Ends in: {timeLeft}</span>
        )}
      </div>

      <button
        style={styles.backBtn}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
        onClick={() => navigate("/elections")}
      >
        ⬅ Back
      </button>

      <h3 style={{ marginTop: "20px" }}>📊 Candidate Votes</h3>
      <div style={styles.candidatesContainer}>
        {candidates.map((c) => (
          <div
            key={c._id}
            style={{
              ...styles.candidateCard,
              border: c.votes === maxVotes ? "2px solid #16a34a" : "1px solid #ccc",
            }}
          >
            <p style={styles.candidateName}>{c.name}</p>
            <p style={styles.candidateVotes}>{c.votes} votes</p>
          </div>
        ))}
      </div>

      {!election.isActive && leaders.length > 0 && (
        <>
          <h3 style={{ marginTop: "30px" }}>🏁 Final Winner</h3>
          <div style={styles.leadersContainer}>
            {leaders.map((c) => (
              <div key={c._id} style={styles.winnerCard}>
                <strong>{c.name}</strong> — {c.votes} votes
              </div>
            ))}
          </div>
        </>
      )}

      {role === "voter" && (
        <button
          style={{
            ...styles.voteBtn,
            opacity: hasVoted || !election.isActive ? 0.5 : 1,
          }}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
          onClick={() => navigate(`/candidates/${election._id}`)}
          disabled={hasVoted || !election.isActive}
        >
          🗳 Vote Now
        </button>
      )}

      {/* LIVE BAR CHART */}
      {candidates.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={candidates}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="votes" isAnimationActive>
              {candidates.map((c, i) => (
                <Cell key={i} fill={c.votes === maxVotes ? "#16a34a" : "#6366f1"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily: "Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    marginTop: "15px",
    padding: "10px 16px",
    cursor: "pointer",
    background: "linear-gradient(90deg, #4f46e5, #6366f1)", // Blue gradient
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  description: {
    fontSize: "16px",
    marginTop: "5px",
    color: "#555",
  },
  status: {
    marginTop: "10px",
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  active: { color: "#16a34a", fontWeight: "bold" },
  closed: { color: "#dc2626", fontWeight: "bold" },
  timer: { fontWeight: "bold", color: "#f59e0b" },
  candidatesContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginTop: "10px",
  },
  candidateCard: {
    flex: "1 1 150px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  candidateName: { fontWeight: "bold", marginBottom: "5px" },
  candidateVotes: { fontSize: "14px", color: "#333" },
  leadersContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  winnerCard: {
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#ecfdf5",
    border: "2px solid #16a34a",
    fontWeight: "bold",
  },
  voteBtn: {
    marginTop: "20px",
    padding: "10px 16px",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
};

export default Results;

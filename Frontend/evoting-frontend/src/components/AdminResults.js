import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import LogoutButton from "./LogoutButton";
import Confetti from "react-confetti";

function AdminResults() {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const token = localStorage.getItem("token");
  const confettiPlayed = useRef(false);

  const fetchResults = useCallback(async () => {
    try {
      const electionRes = await axios.get(
        `/election/one/${electionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setElection(electionRes.data);

      const candidatesRes = await axios.get(
        `/election/results/${electionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCandidates(candidatesRes.data);

      if (
        !electionRes.data.isActive &&
        !confettiPlayed.current &&
        candidatesRes.data.length > 0
      ) {
        const maxVotes = Math.max(
          ...candidatesRes.data.map((c) => c.votes),
          0
        );

        if (maxVotes > 0) {
          setShowConfetti(true);
          confettiPlayed.current = true;
          setTimeout(() => setShowConfetti(false), 6000);
        }
      }
    } catch (err) {
      console.error("Failed to load results", err);
    }
  }, [electionId, token]);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 3000);
    return () => clearInterval(interval);
  }, [fetchResults]);

  if (!election) return <p>Loading results...</p>;

  const maxVotes = Math.max(...candidates.map((c) => c.votes), 0);

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti recycle={false} />}

      <LogoutButton />

      <h2>{election.title} — Results</h2>
      <p>{election.description}</p>

      <p
        style={{
          fontWeight: "bold",
          color: election.isActive ? "green" : "red",
        }}
      >
        {election.isActive ? "🟢 Voting Live" : "🔴 Voting Closed"}
      </p>

      {candidates.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={candidates}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="votes">
              {candidates.map((c, i) => (
                <Cell
                  key={i}
                  fill={c.votes === maxVotes ? "#16a34a" : "#6366f1"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {!election.isActive && maxVotes > 0 && (
        <>
          <h3>🏁 Final Winner</h3>
          {candidates
            .filter((c) => c.votes === maxVotes)
            .map((c) => (
              <p key={c._id}>
                <strong>{c.name}</strong> — {c.votes} votes
              </p>
            ))}
        </>
      )}

      <button
        style={styles.backBtn}
        onClick={() => navigate("/admin")}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f5f6fa",
    minHeight: "100vh",
  },
  backBtn: {
    marginTop: "20px",
    padding: "8px 14px",
    cursor: "pointer",
  },
};

export default AdminResults;

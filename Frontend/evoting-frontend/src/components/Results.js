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

function Results() {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const [data, setData] = useState({
    election: null,
    candidates: [],
    timeLeft: "",
    hasVoted: false,
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const confettiPlayed = useRef(false);

  // ⏱ Countdown
  const calculateTimeLeft = useCallback((endTime) => {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return null;
    const hrs = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const mins = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
    const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      // Fetch election + candidates together
      const [electionRes, candidatesRes] = await Promise.all([
        axios.get(`/election/one/${electionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/election/results/${electionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const electionData = electionRes.data;
      const candidatesData = candidatesRes.data;

      // Check if voter has voted
      const voted = role === "voter" && electionData.voters.includes(userId);

      // Timer
      let tl = "";
      if (electionData.isActive && electionData.endTime) {
        tl = calculateTimeLeft(electionData.endTime);
      }

      // Auto-close if time passed
      if (electionData.isActive && electionData.endTime && !tl) {
        await axios.put(
          `/election/close/${electionId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        electionData.isActive = false;
        tl = null;
      }

      setData({
        election: electionData,
        candidates: candidatesData,
        timeLeft: tl,
        hasVoted: voted,
      });

      // Confetti for final winner
      if (!electionData.isActive && !confettiPlayed.current && candidatesData.length) {
        const maxVotes = Math.max(...candidatesData.map(c => c.votes));
        if (maxVotes > 0) {
          setShowConfetti(true);
          confettiPlayed.current = true;
          setTimeout(() => setShowConfetti(false), 6000);
        }
      }
    } catch (err) {
      console.error("Failed to load results", err);
    }
  }, [electionId, token, userId, role, calculateTimeLeft]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 3000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  if (!data.election) return <p>Loading...</p>;

  const { election, candidates, timeLeft, hasVoted } = data;
  const maxVotes = Math.max(...candidates.map(c => c.votes), 0);
  const leaders = candidates.filter(c => c.votes === maxVotes && maxVotes > 0);
  const votingClosed = !election.isActive;

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti recycle={false} />}
      <LogoutButton />

      <h2>{election.title}</h2>
      <p>{election.description}</p>

      <p style={{ fontWeight: "bold", color: election.isActive ? "green" : "red" }}>
        {election.isActive ? "🟢 Voting Live" : "🔴 Voting has ended"}
      </p>

      {/* ⏱ TIMER */}
      {election.isActive && timeLeft && (
        <p style={styles.timer}>⏱ Voting ends in: {timeLeft}</p>
      )}
      {election.isActive && !timeLeft && (
        <p style={styles.timer}>🛑 Voting period has ended</p>
      )}

      {/* 📊 LIVE BAR CHART */}
      {candidates.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={candidates}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="votes" isAnimationActive>
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

      {/* 🏆 LIVE LEADER */}
      {election.isActive && leaders.length > 0 && (
        <>
          <h3>🏆 Currently Winning</h3>
          {leaders.map((c) => (
            <p key={c._id}>
              <strong>{c.name}</strong> — {c.votes} votes
            </p>
          ))}
        </>
      )}

      {/* 🏁 FINAL WINNER */}
      {!election.isActive && leaders.length > 0 && (
        <>
          <h3>🏁 Final Winner</h3>
          {leaders.map((c) => (
            <p key={c._id}>
              <strong>{c.name}</strong> — {c.votes} votes
            </p>
          ))}
        </>
      )}

      {/* 🗳 VOTE BUTTON */}
      {role === "voter" && (
        <button
          style={{
            ...styles.voteBtn,
            opacity: hasVoted || votingClosed ? 0.5 : 1,
          }}
          onClick={() => navigate(`/candidates/${election._id}`)}
          disabled={hasVoted || votingClosed}
        >
          🗳 Vote Now
        </button>
      )}

      <button style={styles.backBtn} onClick={() => navigate("/elections")}>
        ⬅ Back
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    backgroundColor: "#f5f6fa",
  },
  timer: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#dc2626",
  },
  voteBtn: {
    marginTop: "20px",
    padding: "10px 16px",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  backBtn: {
    marginTop: "30px",
    padding: "8px 14px",
    cursor: "pointer",
  },
};

export default Results;

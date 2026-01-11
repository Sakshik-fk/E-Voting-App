import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import LogoutButton from "./LogoutButton";

function Candidates() {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const intervalRef = useRef(null);

  // ✅ Fetch election + candidates together to prevent flicker
  const fetchData = useCallback(async () => {
    try {
      const [electionRes, candidatesRes] = await Promise.all([
        axios.get(`/election/one/${electionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/election/${electionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const electionData = electionRes.data;
      setElection(electionData);
      setCandidates(candidatesRes.data);

      const voted = electionData.voters.includes(userId);
      setHasVoted(voted);

    } catch (err) {
      console.error("Failed to fetch election data", err);
    }
  }, [electionId, token, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ⏳ Timer + auto update + prevent flicker
  useEffect(() => {
    if (!election?.endTime) return;

    const updateTimer = () => {
      const diff = new Date(election.endTime) - new Date();

      if (diff <= 0) {
        setTimeLeft("Voting period has ended");
        clearInterval(intervalRef.current);
        // Optionally redirect to results automatically
        navigate(`/results/${electionId}`);
        return;
      }

      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}m ${s}s`);
    };

    updateTimer(); // update immediately
    intervalRef.current = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalRef.current);
  }, [election, electionId, navigate]);

  const vote = async (candidateId) => {
    try {
      await axios.post(
        `/vote/${candidateId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh election + candidates atomically to avoid flicker
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Vote failed");
    }
  };

  if (!election) return <p>Loading...</p>;

  const votingClosed =
    !election.isActive || new Date(election.endTime) <= new Date();

  return (
    <div style={{ padding: "30px" }}>
      <LogoutButton />
      <h2>Candidates</h2>

      {!votingClosed && <p style={{ fontWeight: "bold" }}>⏳ Time left: {timeLeft}</p>}
      {votingClosed && <p style={{ fontWeight: "bold" }}>🛑 Voting period has ended</p>}

      {candidates.map((c) => {
        const votedByUser = hasVoted && election.voters.includes(userId);
        // Highlight the candidate voted for
        const isVotedCandidate = votedByUser && election.votedCandidateId === c._id;

        return (
          <div
            key={c._id}
            style={{
              marginBottom: "15px",
              padding: "12px",
              borderRadius: "8px",
              border: isVotedCandidate ? "2px solid #16a34a" : "1px solid #ccc",
              background: isVotedCandidate ? "#ecfdf5" : "#fff",
            }}
          >
            <h3>{c.name}</h3>
            <p>Votes: {c.votes}</p>

            <button
              disabled={hasVoted || votingClosed}
              onClick={() => vote(c._id)}
              style={{
                padding: "8px 12px",
                cursor: hasVoted || votingClosed ? "not-allowed" : "pointer",
                opacity: hasVoted || votingClosed ? 0.6 : 1,
              }}
            >
              {votingClosed
                ? "Voting closed"
                : hasVoted
                ? "Already voted"
                : "🗳 Vote"}
            </button>

            {isVotedCandidate && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                ✅ Your vote
              </p>
            )}
          </div>
        );
      })}

      <button onClick={() => navigate("/elections")}>⬅ Back</button>
    </div>
  );
}

export default Candidates;

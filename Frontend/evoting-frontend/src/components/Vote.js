import { useParams } from "react-router-dom";
import axios from "../api/axiosConfig";

function Vote() {
  const { candidateId, electionId } = useParams();

  const castVote = async () => {
    try {
      await axios.post("/vote/cast", {
        candidateId,
        electionId,
      });
      alert("Vote Cast Successfully");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div>
      <h2>Confirm Vote</h2>
      <button onClick={castVote}>Confirm</button>
    </div>
  );
}

export default Vote;

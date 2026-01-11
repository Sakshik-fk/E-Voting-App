const express = require("express");
const protect = require("../middleware/authMiddleware");

const Election = require("../models/Election");
const Candidate = require("../models/Candidate");

const router = express.Router();

// ------------------------
// CAST VOTE
// ------------------------
router.post("/:candidateId", protect, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const election = await Election.findById(candidate.electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    // ❌ Stop voting if election closed
    if (!election.isActive) {
      return res.status(403).json({ message: "Voting is closed for this election" });
    }

    // ❌ Prevent double voting
    if (election.voters.includes(req.user.id)) {
      return res.status(400).json({ message: "You already voted" });
    }

    // ✅ Vote
    candidate.votes += 1;
    await candidate.save();

    election.voters.push(req.user.id);
    await election.save();

    res.json({ message: "Vote cast successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

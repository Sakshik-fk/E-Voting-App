const express = require("express");
const router = express.Router();

// Middleware
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Models
const Candidate = require("../models/Candidate");
const Election = require("../models/Election");

// ------------------------
// ADD CANDIDATE - Admin only
// ------------------------
router.post("/add", protect, authorize(["admin"]), async (req, res) => {
  try {
    const { name, electionId } = req.body;
    if (!name || !electionId)
      return res.status(400).json({ message: "Name & electionId are required" });

    // Check if election exists
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ message: "Election not found" });

    // Create candidate
    const candidate = await Candidate.create({ name, electionId });

    // Automatically link candidate to election
    election.candidates.push(candidate._id);
    await election.save();

    res.status(201).json({ message: "Candidate added", candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------------
// LIST CANDIDATES FOR AN ELECTION
// ------------------------
router.get("/:electionId", protect, async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionId: req.params.electionId });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

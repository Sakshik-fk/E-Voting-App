const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const Election = require("../models/Election");
const Candidate = require("../models/Candidate");

const router = express.Router();

// ------------------------
// CREATE ELECTION (ADMIN)
// ------------------------
router.post(
  "/create",
  protect,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      const election = await Election.create({
  title,
  description: description || "",
  createdBy: req.user.id,
  isActive: true,

  // ⏱ ADD THIS LINE
  endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour

  candidates: [],
  voters: [],
});


      res.status(201).json({ message: "Election created", election });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ------------------------
// GET ALL ELECTIONS (ADMIN)
// ------------------------
router.get(
  "/all",
  protect,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const elections = await Election.find().sort({ createdAt: -1 });
      res.json(elections);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ------------------------
// GET ALL ELECTIONS (VOTER)
// ------------------------
router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const elections = await Election.find().sort({ createdAt: -1 });
      res.json(elections);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET SINGLE ELECTION BY ID
router.get("/one/:electionId", protect, async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    res.json(election);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------
// GET CANDIDATES OF ELECTION
// ------------------------
router.get(
  "/:electionId",
  protect,
  async (req, res) => {
    try {
      const candidates = await Candidate.find({
        electionId: req.params.electionId
      });
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ------------------------
// GET ELECTION RESULTS
// ------------------------
// ------------------------
// GET ELECTION RESULTS
// ------------------------
router.get(
  "/results/:electionId",
  protect,
  async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);

      if (!election) {
        return res.status(404).json({ message: "Election not found" });
      }

      // 🚫 Block voters if election is still active
      // if (election.isActive && req.user.role === "voter") {
      //   return res.status(403).json({
      //     message: "Results will be available after election closes"
      //   });
      // }

      const candidates = await Candidate.find({
        electionId: req.params.electionId
      }).sort({ votes: -1 });

      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
// CHECK IF USER HAS VOTED
router.get("/has-voted/:electionId", protect, async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) return res.status(404).json({ voted: false });

    const voted = election.voters.includes(req.user.id);
    res.json({ voted });
  } catch (err) {
    res.status(500).json({ voted: false });
  }
});


// ------------------------
// CLOSE ELECTION (ADMIN)
// ------------------------
router.put(
  "/close/:electionId",
  protect,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const election = await Election.findById(req.params.electionId);
      if (!election) {
        return res.status(404).json({ message: "Election not found" });
      }

      election.isActive = false;
      await election.save();

      res.json({ message: "Election closed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;

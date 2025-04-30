const express = require("express")
const router = express.Router()
const {addMatch, getMatches, deleteMatch} = require("../controllers/matchesController")
const authChain = require("../middleware/authChain");


// POST: Add a matched result
router.post("/", authChain, addMatch)

// GET: Retrieve matched results for the current user
router.get("/", authChain, getMatches)

// DELETE: Remove a matched result
router.delete("/:match_id", authChain, deleteMatch)

module.exports = router
const express = require("express")
const router = express.Router()
const pool = require("../db")
const auth = require("../middleware/authMiddleware")

// POST: Add a matched result
router.post("/", auth, async (req, res) => {
    const user_id = req.user.user_id
    const {preference_id, listing_id} = req.body

    try {
        // check if the listing already exists in matched_results for this user & preferences
        const existingMatch = await pool.query(
            `SELECT * FROM matched_results 
            WHERE preference_id = $1 AND listing_id = $2`,
            [preference_id, listing_id]
        )

        if (existingMatch.rows.length > 0) {
            return res.status(400).json({error: "Match already exists"})
        }

        // Insert the matched result into the database
        const newMatch = await pool.query(
            `INSERT INTO matched_results (preference_id, listing_id, matched_at) 
            VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *`,
            [preference_id, listing_id]
        )

        res.status(201).json(newMatch.rows[0]) // Return the new match

    } catch (err) {
        console.error("Add matched result error: ", err.message)
        res.status(500).json({error: "Failed to add matched result"})
    }
})

// GET: Retrieve matched results for the current user
router.get("/", auth, async (req, res) => {
    const user_id = req.user.user_id

    try {
        // Get all matched results for the user, join with listings to get detailed information
        const matchedResults = await pool.query(
            `SELECT
                m.matched_id AS match_id, 
                m.preference_id, 
                m.listing_id, 
                l.* 
             FROM matched_results m 
             JOIN listings l on m.listing_id = l.listing_id 
             WHERE m.preference_id IN (
                SELECT preference_id FROM preferences WHERE user_id = $1
             )
             ORDER BY m.matched_at DESC`,
             [user_id]
        )

        if (matchedResults.rows.length === 0) {
            return res.status(404).json({error: "No matched results found"})
        }

        res.status(200).json(matchedResults.rows) // Return the matched results

    } catch (err) {
        console.error("Get matched results error: ", err.message)
        res.status(500).json({error: "Failed to get matched results"})
    }
})

module.exports = router
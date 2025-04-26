const express = require("express")
const router = express.Router()
const pool = require("../db")
const authChain = require("../middleware/authChain");


// POST: Add a matched result
router.post("/", authChain, async (req, res) => {
    const user_id = req.user_id
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
router.get("/", authChain, async (req, res) => {
    const user_id = req.user_id

    try {
        // Get all matched results for the user, join with listings to get detailed information
        const matchedResults = await pool.query(
            `SELECT
                match_id, 
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

// DELETE: Remove a matched result
router.delete("/:match_id", authChain, async (req, res) => {
    const {match_id} = req.params
    // console.log(match_id)
    const user_id = req.user_id
    // console.log(user_id)

    try {
        // Check if matched result belongs to the user
        const match = await pool.query(
            `SELECT m.* FROM matched_results m
             JOIN preferences p ON m.preference_id = p.preference_id 
             WHERE m.match_id = $1 AND p.user_id = $2`,
            [match_id, user_id]
        )

        if (match.rows.length === 0) {
            return res.status(404).json({error: "Matched result not found or not authorized"})
        }

        // Delete the matched result
        await pool.query(
            `DELETE FROM matched_results WHERE match_id = $1`,
            [match_id]
        )

        res.status(200).json({message: "Matched result deleted"})

    } catch (err) {
        console.error("Delete matched result error: ", err.message)
        res.status(500).json({error: "Failed to delete matched result"})
    }
})

module.exports = router
const express = require("express")
const router = express.Router()
const pool = require("../db")
const auth = require("../middleware/authMiddleware")
const attachUserId = require("../middleware/attachUserId")

// ADD a favorite
router.post("/", auth, attachUserId, async (req, res) => {
    const user_id = req.user_id
    const {listing_id} = req.body

    try {
        await pool.query(
            `INSERT INTO favorites (user_id, listing_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, listing_id) DO NOTHING`, // Avoid duplicate favorites
            [user_id, listing_id]
        )

        res.status(201).json({message: "Item added to favorites"})

    } catch (err) {
        console.error("Add favorite error: ", err.message)
        res.status(500).json({error: "Failed to add favorite"})
    }
})

// GET all favorites for a user
router.get("/", auth, attachUserId, async (req, res) => {
    const user_id = req.user_id

    try {
        const favorites = await pool.query(
            `SELECT f.*, l.* FROM favorites f
            JOIN listings l ON f.listing_id = l.listing_id 
            WHERE f.user_id = $1 
            ORDER BY f.favorited_at DESC`,
            [user_id]
        )

        res.status(200).json(favorites.rows)

    } catch (err) {
        console.error( "Get favorites error: ", err.message)
        res.status(500).json({error: "Failed to fetch favorites"})
    }
})

// DELETE a favorite
router.delete("/:listing_id", auth, attachUserId, async (req, res) => {
    const user_id = req.user_id
    // console.log("User ID: ", user_id)
    const {listing_id} = req.params
    // console.log("Listing ID: ", listing_id)

    try {

        // Check if favorite exists
        const favoriteExists = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1 AND listing_id = $2',
            [user_id, listing_id]
        )

        if (favoriteExists.rows.length === 0) {
            return res.status(404).json({error: "Favorite not found"})
        }

        // Delete the favorite
        await pool.query(
            'DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2',
            [user_id, listing_id]
        )

        res.status(200).json({message: "Favorite removed"})

    } catch (err) {
        console.error("Remove favorite error: ", err.message)
        res.status(500).json({error: "Failed to remove favorite"})
    }
})

module.exports = router
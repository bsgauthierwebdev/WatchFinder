const pool = require("../db")

// Add favorite
const addFavorite = async (req, res) => {
    const user_id = req.user.user_id
    const {listing_id} = req.body

    try {
        await pool.query(
            `INSERT INTO favorites (user_id, listing_id)
             VALUES ($1, $2) 
             ON CONFLICT (user_id, listing_id) DO NOTHING`,
            [user_id, listing_id]
        )

        res.status(201).json({message: "Item added to favorites"})

    } catch (err) {
        console.error("Add favorite error: ", err.message)
        res.status(500).json({error: "Failed to add favorite"})
    }
}

// Get all favorites for a user
const getFavorites = async (req, res) => {
    const user_id = req.user.user_id

    try {
        const data = await pool.query(
            `SELECT f.*, l.* FROM favorites f
             JOIN listings l ON f.listing_id = l.listing_id 
             WHERE f.user_id = $1 
             ORDER BY f.favorited_at DESC`,
            [user_id]
        )

        res.status(200).json(data.rows)

    } catch (err) {
        console.error("Get Favorites Error: ", err.message)
        res.status(500).json({error: "Failed to get favorites"})
    }
}

// Delete favorites from list
const deleteFavorite = async (req, res) => {
    const user_id = req.user.user_id
    const {listing_id} = req.params

    try {
        // Check if favorite exists
        const favorites = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1 AND listing_id = $2',
            [user_id, listing_id]
        )

        if (favorites.rows.length === 0) {
            return res.status(404).json({error: "Favorite not found"})
        }

        await pool.query(
            'DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2',
            [user_id, listing_id]
        )

        res.status(200).json({message: "Listing removed from your favorites"})

    } catch (err) {
        console.error("Delete favorite error: ", err.message)
        res.status(500).json({error: "Could not remove favorite"})
    }
}

module.exports = {addFavorite, getFavorites, deleteFavorite}
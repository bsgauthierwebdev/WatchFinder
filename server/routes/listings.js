const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")
const pool = require("../db")

// POST - Add a new listing
router.post("/", auth, async (req, res) => {
    const {
        platform, title, url, image_url, price, brand, 
        case_size, strap_style, movement, watch_style, 
        seller_location, condition, dial_color
    } = req.body

    try {
        const newListing = await pool.query(
            `INSERT INTO listings (
                platform, title, url, image_url, price, brand, 
                case_size, strap_style, movement, watch_style, 
                seller_location, condition, dial_color
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 
            ) RETURNING *`,
             [
                platform, title, url, image_url, price, brand, 
                case_size, strap_style, movement, watch_style, 
                seller_location, condition, dial_color
             ]
        )

        res.status(201).json(newListing.rows[0])

    } catch (err) {
        console.error("Add listing error: ", err.message)
        res.status(500).json({error: "Failed to add listing"})
    }
})

 // GET - Get all listings (optionally filtered)
 router.get("/", async (req, res) => {
    const {platform, price_min, price_max, brand} = req.query

    try {
        let query = 'SELECT * FROM listings WHERE 1=1'
        let queryParams = []

        if (platform) {
            query += ' AND platform = $' + (queryParams.length + 1)
            queryParams.push(platform)
        }

        if (price_min) {
            query += ' AND price >= $' + (queryParams + 1)
            queryParams.push(price_min)
        }

        if (price_max) {
            query += ' AND price <= $' + (queryParams + 1)
            queryParams.push(price_max)
        }

        if (brand) {
            query += ' AND brand = $' + (queryParams + 1)
            queryParams.push(brand)
        }

        const listings = await pool.query(query, queryParams)

        if (listings.rows.length === 0 ) {
            return res.status(404).json({error: "No listings found"})
        }

        res.status(200).json(listings.rows)

    } catch (err) {
        console.error("Get listings error: ", err.message)
        res.status(500).json({error: "Failed to get listings"})
    }
 })

 // GET - Get a single listing by ID
 router.get("/:id", async (req, res) => {
    const {id} = req.params

    try {
        const listing = await pool.query(
            'SELECT * FROM listings WHERE listing_id = $1',
            [id]
        )

        if (listing.rows.length === 0) {
            return res.status(404).json({error: "Listing not found"})
        }

        res.status(200).json(listing.rows[0])

    } catch (err) {
        console.error("Get listing by ID error: ", err.message)
        res.status(500).json({error: "Failed to get listing"})
    }
 })

 // DELETE - Delete a listing
 router.delete("/:id", auth, async (req, res) => {
    const {id} = req.params

    try {
        const listing = await pool.query(
            'SELECT * FROM listings WHERE listing_id = $1',
            [id]
        )

        if (listing.rows.length === 0) {
            return res.status(404).json({error: "Listing not found"})
        }

        await pool.query(
            'DELETE FROM listings WHERE listing_id = $1',
            [id]
        )

        res.status(200).json({message: "Listing deleted successfully"})

    } catch (err) {
        console.error("Delete listing error: ", err.message)
        res.status(500).json({error: "Failed to delete listing"})
    }
 })

 module.exports = router
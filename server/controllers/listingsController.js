const pool = require("../db")

// Add listing
const addListing = async (req, res) => {
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
        console.error("Error adding listing: ", err.message)
        res.status(500).json({error: "Listing could not be added"})
    }
}

// Get user's listings
const getUserListings = async (req, res) => {
    const {
        platform,
        brand,
        movement,
        price_min,
        price_max,
        case_size_min,
        case_size_max,
        sort,
        limit = 10,
        page = 1
    } = req.query

    try {
        // Start building query
        let query = `SELECT * FROM listings WHERE 1 = 1`
        let countQuery = `SELECT COUNT(*) FROM listings WHERE 1 = 1`
        const values = []
        const countValues = []

        const appendCondition = (field, operator, value) => {
            values.push(value)
            countValues.push(value)
            const paramIndex = values.length
            query += ` AND ${field} ${operator} $${paramIndex}`
            countQuery += ` AND ${field} ${operator} $${paramIndex}`
        }

        // Apply filters
        if (platform) appendCondition("platform", "ILIKE", `%${platform}%`)
        if (brand) appendCondition("brand", "ILIKE", `%${brand}%`)
        if (movement) appendCondition("movement", "ILIKE", `%${movement}%`)
        if (price_min) appendCondition("price", ">=", price_min)
        if (price_max) appendCondition("price", "<=", price_max)
        if (case_size_min) appendCondition("case_size", ">=", case_size_min)
        if (case_size_max) appendCondition("case_size", "<=", case_size_max)

        // Sorting
        const sortOptions = {
            price_asc: "price ASC",
            price_desc: "price DESC",
            date_newest: "created_at DESC",
            date_oldest: "created_at ASC"
        }
        query += ` ORDER BY ${sortOptions[sort] || "created_at DESC"}`

        // Pagination
        const pageInt = parseInt(page)
        const limitInt = parseInt(limit)
        const offset = (pageInt - 1) * limitInt

        values.push(limitInt, offset)
        query += ` LIMIT $${values.length - 1} OFFSET $${values.length}`
        
        // Run queries
        const listings = await pool.query(query, values)
        const count = await pool.query(countQuery, countValues)
        const total = parseInt(count.rows[0].count)
        const totalPages = Math.ceil(total / limitInt)

        // if (listings.rows.length === 0) {
        //     return res.status(404).json({error: "No listings found"})
        // }


        res.status(200).json({
            total,
            totalPages,
            currentPage: pageInt,
            results: listings.rows
        })

    } catch (err) {
        console.error("Error fetching filtered listings: ", err.message)
        res.status(500).json({error: "Failed to fetch listings"})
    }
}

// Get single listing by id
const getSingleListing = async (req, res) => {
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
}

// Delete a listing
const deleteListing = async (req, res) => {
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
}

module.exports = {addListing, getUserListings, getSingleListing, deleteListing}
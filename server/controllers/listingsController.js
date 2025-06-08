const pool = require("../db")

// Add listing
const addListing = async (req, res) => {
    const {
        platform, title, url, price, brand, 
        case_size, strap_style, movement, watch_style, 
        seller_location, condition, dial_color, image_urls
    } = req.body

    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        const newListing = await client.query(
            `INSERT INTO listings (
                platform, title, url, price, brand, 
                case_size, strap_style, movement, watch_style, 
                seller_location, condition, dial_color
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 
            ) RETURNING *`,
             [
                platform, title, url, price, brand, 
                case_size, strap_style, movement, watch_style, 
                seller_location, condition, dial_color
             ]
        )

        const listingId = newListing.rows[0].listing_id

        // Insert images into listing_images if present
        if (Array.isArray(image_urls) && image_urls.length > 0) {
            const imageInsertQuery = `
                INSERT INTO listing_images (listing_id, image_url)
                VALUES ($1, $2)
            `

            for (let image_url of image_urls) {
                await client.query(imageInsertQuery, [listingId, image_url])
            }
        }

        await client.query("COMMIT")
        res.status(201).json(newListing.rows[0])

    } catch (err) {
        await client.query("ROLLBACK")
        console.error("Error adding listing: ", err.message)
        res.status(500).json({error: "Listing could not be added"})
    }
    finally {
        client.release()
    }
}

// Get all listings
const getAllListings = async (req, res) => {
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
        // Base queries
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

        // Optional filters
        if (platform) appendCondition("platform", "iLIKE", `%${platform}`)
        if (brand) appendCondition("brand", "iLIKE", `%${brand}`)
        if (movement) appendCondition("movement", "iLIKE", `%${movement}`)
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

        // Execute
        const listings = await pool.query(query, values)
        const count = await pool.query(countQuery, countValues)
        const total = parseInt(count.rows[0].count)
        const totalPages = Math.ceil(total / limitInt)

        // Fetch images
        const imageResult = await pool.query(
            "SELECT * FROM listing_images"
        )
        const imageMap = {}
        for (const img of imageResult.rows) {
            if (!imageMap[img.listing_id]) imageMap[img.listing_id] = []
            imageMap[img.listing_id].push(img.image_url)
        }

        // Add images to each listing
        const enrichedListings = listings.rows.map(listing => ({
            ...listing,
            images: imageMap[listing.listing_id] || []
        }))

        // Send response
        res.status(200).json({
            total,
            totalPages,
            currentPage: pageInt,
            results: enrichedListings
        })
    } catch (err) {
        console.error("Error fetching listings: ", err.message)
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

module.exports = {addListing, getAllListings, getSingleListing, deleteListing}
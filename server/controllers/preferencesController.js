const pool = require("../db")

// POST: Create or Update preferences
const setPrefs = async (req, res) => {
    const user_id = req.user_id
    const {
        platforms,
        brands,
        case_size_min,
        case_size_max,
        strap_styles,
        movements,
        watch_styles,
        price_min,
        price_max,
        seller_location,
        condition,
        dial_colors,
        frequency
    } = req.body
    
    try {
        // Check if preferences already exist
        const existing = await pool.query(
            'SELECT * FROM preferences WHERE user_id = $1',
            [user_id]
        )

        if (existing.rows.length > 0) {
            // Update
            await pool.query(
                `UPDATE preferences SET
                    platforms = $1, brands = $2, case_size_min = $3, case_size_max = $4, 
                    strap_styles = $5, movements = $6, watch_styles = $7, 
                    price_min = $8, price_max = $9, seller_location = $10, 
                    condition = $11, dial_colors = $12, frequency = $13 
                WHERE user_id = $14`,
                [
                    platforms, brands, case_size_min, case_size_max, 
                    strap_styles, movements, watch_styles, 
                    price_min, price_max, seller_location, condition, dial_colors, frequency, 
                    user_id
                ]
            )

            return res.status(200).json({message: "Preferences updated"})
        } 

        else {
            // Insert new
            await pool.query(
                `INSERT INTO preferences (
                user_id, platforms, brands, case_size_min, case_size_max, 
                strap_styles, movements, watch_styles, 
                price_min, price_max, seller_location, 
                condition, dial_colors, frequency
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
                 [user_id, platforms, brands, case_size_min, case_size_max, 
                    strap_styles, movements, watch_styles,
                    price_min, price_max, seller_location,  
                    condition, dial_colors, frequency
                 ]
            )
            return res.status(201).json({message: "Preferences saved"})
        }

    } catch (err) {
        console.error("Preferences error: ", err.message)
        res.status(500).json({error: "Failed to save preferences"})
    }
}

// GET: Get preferences for current user
const getPrefs = async (req, res) => {
    const user_id = req.user_id

    try {
        const prefs = await pool.query(
            'SELECT * FROM preferences WHERE user_id = $1',
            [user_id]
        )

        if (prefs.rows.length === 0) {
            return res.status(404).json({error: "No preferences found"})
        }

        return res.status(200).json(prefs.rows[0])
    } catch (err) {
        console.error("Get preferences error: ", err.message)
        res.status(500).json({error: "Failed to get preferences"})
    }
}

module.exports = {setPrefs, getPrefs}
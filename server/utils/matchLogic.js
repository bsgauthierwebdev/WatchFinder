const pool = require("../db")

const matchListingsToPreferences = async () => {
    const users = await pool.query(
        'SELECT * FROM preferences'
    )

    for (let pref of users.rows) {
        const listings = await pool.query(
            `SELECT * FROM listings
             WHERE platform = ANY($1)
             AND brand = ANY($2) 
             AND case_size BETWEEN $3 AND $4 
             AND strap_style = ANY($5) 
             AND movement = ANY($6) 
             AND watch_style = ANY($7) 
             AND price BETWEEN $8 AND $9 
             AND seller_location = $10 
             AND condition = ANY($11) 
             AND dial_color = ANY($12)`,
            
            [
                pref.platforms,
                pref.brands,
                pref.case_size_min,
                pref.case_size_max,
                pref.strap_styles,
                pref.movements,
                pref.watch_styles,
                pref.price_min,
                pref.price_max,
                pref.seller_location,
                pref.condition,
                pref.dial_colors
            ]
        )

        for (let listing of listings.rows) {
            await pool.query(
                `INSERT INTO matched_results (user_id, preference_id, listing_id, matched_at)
                 VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                 ON CONFLICT DO NOTHING`,
                [pref.user_id, pref.preference_id, listing.listing_id]
            )
        }
    }

    console.log("✅ Matching complete")
}

module.exports = matchListingsToPreferences
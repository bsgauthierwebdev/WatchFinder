const pool = require("../db")
const sendEmail = require("../utils/sendEmail")

const matchListingsToPreferences = async () => {
    const users = await pool.query(
        'SELECT * FROM preferences'
    )

    for (let pref of users.rows) {
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const listings = await client.query(
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

            let newMatches = 0
            let listingSummaries = []
    
            for (let listing of listings.rows) {
                const result = await client.query(
                    `INSERT INTO matched_results (user_id, preference_id, listing_id, matched_at)
                     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                     ON CONFLICT DO NOTHING`,
                    [pref.user_id, pref.preference_id, listing.listing_id]
                )
                if (result.rowCount > 0) {
                    newMatches++
                    listingSummaries.push(`<li>${listing.brand} - ${listing.model || 'Unknown Model'} - $${listing.price}</li>`)
                }
            }

            await client.query('COMMIT')

            if (newMatches > 0) {
                const userRes = await pool.query(
                    'SELECT email FROM users WHERE user_id = $1',
                    [pref.user_id]
                )

                const email = userRes.rows[0]?.email

                if (email) {
                    const subject = "🎯 New Watch Matches Just For You!!"
                    const html = `
                        <p>We found <strong>${newMatches} new listings that match your preferences:</p>
                        <ul>${listingSummaries.join('')}</ul>
                        <p><a href = "${process.env.BASE_URL}/dashboard">Log in</a> to view full details and contact sellers.
                    `
                    await sendEmail(email, subject, html)
                    console.log(`📧 Email sent to ${email} with ${newMatches} new matches`)
                }
            }

        } catch (err) {
            await client.query('ROLLBACK')
            console.error(`❌ Transaction failed for user ${pref.user_id}: `, err.message)
        } finally {
            client.release()
        }
        
    }

    console.log("✅ Matching complete")
}

module.exports = matchListingsToPreferences
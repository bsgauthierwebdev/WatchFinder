const pool = require("../db")

// Reusable middleware
const checkOwnership = (table, idField) => {
    return async (req, res, next) => {
        const user_id = req.user.user_id
        const resource_id = req.params.id // If the field has a dynamic id

        try {
            const result = await pool.query(
                `SELECT user_id FROM ${table} WHERE ${idField} = $1`,
                [resource_id]
            )

            if (result.rows.length === 0) {
                return res.status(404).json({error: "Resource not found"})
            }

            if (result.rows[0].user_id !== user_id) {
                return res.status(403).json({error: "Forbidden: Not your resource"})
            }

            next() // Ownership confirmed, move to the next step

        } catch (err) {
            console.error("Ownership check error: ", err.message)
            res.status(500).json({error: "Server error during ownership check"})
        }
    }
}

module.exports = {checkOwnership}
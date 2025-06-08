const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const dotenv = require("dotenv")
const path = require("path")
const {validationResult} = require("express-validator")
dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET || 'supersecret' 

// GET: Get user info
const getUserInfo = async (req, res) => {
    try {
        const userId = req.user.user_id

        // 1. Get user details & preferences
        const userData = await pool.query(
            `SELECT u.user_id, u.username, u.email, u.profile_img_url,
                p.*
             FROM users u
             LEFT JOIN preferences p ON u.user_id = p.user_id
             WHERE u.user_id = $1`,
            [userId]
        )

        if (userData.rows.length === 0) {
            return res.status(404).json({error: "User not found"})
        }

        const user = userData.rows[0]

        // 2. Get all listing images
        const imagesResult = await pool.query(
            'SELECT listing_id, image_url FROM listing_images'
        )

        const imageMap = {}
        for (const row of imagesResult.rows) {
            if (!imageMap[row.listing_id]) imageMap[row.listing_id] = []
            imageMap[row.listing_id].push(row.image_url)
        }

        // 3. Get matched results with listing info
        const matchesData = await pool.query(
            `SELECT m.*, l.title, l.brand, l.price, l.listing_id
             FROM matched_results m
             JOIN listings l ON m.listing_id = l.listing_id
             WHERE m.user_id = $1
             ORDER BY m.matched_at DESC
             LIMIT 20`,
            [userId]
        )

        const enrichedMatches = matchesData.rows.map(match => ({
            ...match,
            images: imageMap[match.listing_id] || []
        }))

        // 4. Get favorites with listing info
        const favoritesData = await pool.query(
            `SELECT f.*, l.title, l.brand, l.price, l.listing_id
             FROM favorites f
             JOIN listings l ON f.listing_id = l.listing_id
             WHERE f.user_id = $1`,
             [userId]
        )

        const enrichedFavorites = favoritesData.rows.map(fav => ({
            ...fav,
            images: imageMap[fav.listing_id] || []
        }))

        // 5. Build response
        const responseData = {
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                profile_img: user.profile_img_url
            },
            preferences: {
                preference_id: user.preference_id,
                platforms: user.platforms,
                brands: user.brands,
                case_size_min: user.case_size_min,
                case_size_max: user.case_size_max,
                strap_styles: user.strap_styles,
                movements: user.movements,
                watch_styles: user.watch_styles,
                price_min: user.price_min,
                price_max: user.price_max,
                seller_location: user.seller_location,
                condition: user.condition,
                dial_colors: user.dial_colors,
                frequency: user.frequency,
                created_at: user.created_at
            },
            matched_results: enrichedMatches,
            favorites: enrichedFavorites
        }

        res.json(responseData)
        
    } catch (err) {
        console.error("Error in /me route: ", err.message)
        res.status(500).json({error: "Server error"})
    }
}

// GET: Dashboard route
const authorizeUser = async (req, res) => {
    try {
        // get the token from Authorization header
        const authHeader = req.header("Authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({error: "Authorization header missing or malformed"})
        }

        const token = authHeader.replace("Bearer ", "").trim()

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET)

        // Inline query to get user data from dB
        const result = await pool.query(
            'SELECT user_id, username, email, profile_img_url FROM users WHERE user_id = $1',
            [decoded.user_id]
        )

        const user = result.rows[0]
        if (!user) {
            return res.status(404).json({error: "User not found"})
        }

        // Send user data in response
        res.json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            profile_img_url: user.profile_img_url
        })

    } catch (err) {
        console.error("Dashboard error: ", err.message)
        res.status(401).json({error: "Invalid token"})
    }
}

// POST: Logout user
const logout = async (req, res) => {
    // Client just deletes token on that side
    res.json({message: "Logged out successfully"})
}

// PUT: Update username
const updateUsername = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const token = req.header("Authorization")?.replace("Bearer ", "").trim()
        if (!token) {
            return res.status(401).json({error: "Missing or invalid token"})
        }

        const data = jwt.verify(token, JWT_SECRET)
        const userId = data?.user_id
        if (!userId) {
            return res.status(400).json({error: "Invalid token payload"})
        }

        const {username} = req.body

        // Check if username already exists
        const inUse = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        )

        if (inUse.rows.length > 0) {
            return res.status(409).json({error: "Username already exists"})
        }

        await pool.query(
            'UPDATE users SET username = $1 WHERE user_id = $2',
            [username, userId]
        )

        res.status(200).json({message: `Username updated to ${username}`})

    } catch (err) {
        console.error("Update Error: ", err.message)
        res.status(500).json({error: "Failed to update username"})
    }
}

// PUT: Update email address
const updateEmail = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const token = req.header("Authorization")?.replace("Bearer ", "").trim()
    if (!token) {
        return res.status(401).json({error: "Invalid or missing token"})
    }

    const data = jwt.verify(token, JWT_SECRET)
    const userId = data?.user_id
    if (!userId) {
        return res.status(400).json({error: "Invalid token payload"})
    }

    const {email} = req.body
    if (!email) {
        return res.status(400).json({error: "Please enter your updated email"})
    }

    // Check if email already exists
    const inUse = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    )

    if (inUse.rows.length > 0) {
        return res.status(409).json({error: "Email address already exists"})
    }

    await pool.query(
        'UPDATE users SET email = $1 WHERE user_id = $2',
        [email, userId]
    )

    res.status(200).json({message: `Email address updated to ${email}`})

    } catch (err) {
        console.error("Error updating email: ", err.message)
        res.status(500).json({error: "Email could not be updated"})
    }
}

// PUT: Update password
const updatePassword = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const authHeader = req.header("Authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({error: "Authorization header missing or malformed"})
        }

        const token = authHeader.replace("Bearer ", "").trim()
        const decoded = jwt.verify(token, JWT_SECRET)
        const userId = decoded.user_id

        const {currentPassword, newPassword} = req.body

        if (currentPassword === newPassword) {
            return res.status(400).json({error: "New password cannot be the same as the last password"})
        }

        const userRes = await pool.query(
            'SELECT password FROM users WHERE user_id = $1',
            [userId]
        )
        const user = userRes.rows[0]

        const valid = await bcrypt.compare(currentPassword, user.password)
        if (!valid) {
            return res.status(401).json({error: "Current password is incorrect"})
        }

        const hashedNew = await bcrypt.hash(newPassword, 10)
        await pool.query(
            'UPDATE users SET password = $1 WHERE user_id = $2',
            [hashedNew, userId]
        )

        res.status(200).json({message: "Password updated successfully"})
        
    } catch (err) {
        console.error("Change password error: ", err.message)
        res.status(500).json({error: "Failed to change password"})
    }
}

// PUT: Update profile pic
const updateProfilePic = async (req, res) => {
    try {
        const authHeader = req.header("Authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({error: "Unauthorized"})
        }

        const token = authHeader.replace("Bearer ", "").trim()
        const data = jwt.verify(token, JWT_SECRET)
        const userId = data.user_id

        if (!req.file) {
            return res.status(400).json({error: "No image uploaded"})
        }

        const imageUrl = path.posix.join("/uploads", req.file.filename) // Stored path

        await pool.query(
            'UPDATE users SET profile_img_url = $1 WHERE user_id = $2',
            [imageUrl, userId]
        )

        res.status(200).json({message: "Profile picture updated", imageUrl})
    } catch (err) {
        console.error("Error updating profile image: ", err.message)
        res.status(500).json({error: "Could not update user image"})
    }
}

// POST: Forgot password
const forgotPassword = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {email} = req.body

    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )
        if (user.rows.length === 0) {
            return res.status(200).json({error: "If that email exists, a reset link has been sent"})
        }

        const token = crypto.randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 3600000)

        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
            [token, expires, email]
        )

        const resetLink = `${process.env.BASE_URL}/reset-password/${token}`
        const html = `<p>Click <a href = "${resetLink}">here</a> to reset your password. This link will expire in 1 hour.`

        await sendEmail(email, "Reset your password", html)

        res.status(200).json({message: "If that email exists, a reset link has been sent"})

    } catch (err) {
        console.error("Forgot password error:", err.message)
        res.status(500).json({error: "Failed to send password reset email"})
    }
}

// POST: Reset password
const resetPassword = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {token} = req.params
    const {password} = req.body

    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
            [token]
        )

        if (user.rows.length === 0) {
            return res.status(400).json({error: "Invalid or expired token"})
        }

        const hashed = await bcrypt.hash(password, 10)

        await pool.query(
            'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = $2',
            [hashed, token]
        )

        res.status(200).json({message: "Password has been reset"})
        
    } catch (err) {
        console.error("Reset password error: ", err.message)
        res.status(500).json({error: "Failed to reset password"})
    }
}

// DELETE: Delete account
const deleteAccount = async (req, res) => {
    try {
        const authHeader = req.header("Authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({error: "Authorization header missing or malformed"})
        }

        const token = authHeader.replace("Bearer ", "").trim()
        const decoded = jwt.verify(token, JWT_SECRET)

        await pool.query(
            'DELETE FROM users WHERE user_id = $1',
            [decoded.user_id]
        )

        res.status(200).json({message: "User deleted successfully"})

    } catch (err) {
        console.error("Delete error: ", err.message)
        res.status(401).json({error: "Invalid token or failed to delete user"})
    }
}

module.exports = {getUserInfo, authorizeUser, logout, updateUsername, updateEmail, updatePassword, updateProfilePic, forgotPassword, resetPassword, deleteAccount}
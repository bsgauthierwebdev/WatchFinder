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
        // console.log(userId)

        const result = await pool.query(
            'SELECT user_id, username, email FROM users WHERE user_id = $1',
            [userId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({error: "User not found"})
        }

        res.json(result.rows[0])

    } catch (err) {
        console.error("Error fetching user: ", err.message)
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
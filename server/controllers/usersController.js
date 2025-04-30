const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const dotenv = require("dotenv")
dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET || 'supersecret' 

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
            'SELECT user_id, username, email FROM users WHERE user_id = $1',
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
            email: user.email
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

// PUT: Update username and/or email
const updateAccount = async (req, res) => {
    try {
        const authHeader = req.header("Authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({error: "Authorization header missing or malformed"})
        }

        const token = authHeader.replace("Bearer ", "").trim()
        const decoded = jwt.verify(token, JWT_SECRET)
        const userId = decoded.user_id

        const {username, email} = req.body

        const trimmedUsername = username.trim()
        const trimmedEmail = email.trim()

        // Simple validation
        if (!trimmedUsername || !trimmedEmail) {
            return res.status(400).json({error: "Username and email are required"})
        }

        // Optional: Check if the email or username is already taken
        const userCheck = await pool.query(
            'SELECT * FROM users WHERE (username = $1 OR email = $2) AND user_id != $3',
            [trimmedUsername, trimmedEmail, userId]
        )

        if (userCheck.rows.length > 0) {
            return res.status(409).json({error: "Username or email already exists"})
        }

        // Update user info
        await pool.query(
            'UPDATE users SET username = $1, email = $2 WHERE user_id = $3',
            [trimmedUsername, trimmedEmail, userId]
        )

        res.status(201).json({message: "User info updated successfully"})
    } catch (err) {
        console.error("Update error: ", err.message)
        res.status(500).json({error: "Failed to update user"})
    }
}

// PUT: Update password
const updatePassword = async (req, res) => {
    try {
        const authHeader = req.header("Authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({error: "Authorization header missing or malformed"})
        }

        const token = authHeader.replace("Bearer ", "").trim()
        const decoded = jwt.verify(token, JWT_SECRET)
        const userId = decoded.user_id

        const {currentPassword, newPassword} = req.body

        if (!currentPassword | !newPassword) {
            return res.status(400).json({error: "Current and new password are required"})
        }

        const userRes = await pool.query(
            'SELECT password FROM users WHERE user_id = $1',
            [userId]
        )
        const user = userRes.rows[0]

        const valid = await bcrypt.compare(currentPassword.trim(), user.password)
        if (!valid) {
            return res.status(401).json({error: "Current password is incorrect"})
        }

        const hashedNew = await bcrypt.hash(newPassword.trim(), 10)
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

// POST: Forgot password
const forgotPassword = async (req, res) => {
    const {email} = req.body

    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email.trim()]
        )
        if (user.rows.length === 0) {
            return res.status(404).json({error: "Email not found"})
        }

        const token = crypto.randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 3600000)

        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
            [token, expires, email.trim()]
        )

        const resetLink = `${process.env.BASE_URL}/reset-password/${token}`
        const html = `<p>Click <a href = "${resetLink}">here</a> to reset your password. This link will expire in 1 hour.`

        await sendEmail(email, "Reset your password", html)

        res.json({message: "Password reset email sent"})

    } catch (err) {
        console.error("Forgot password error:", err.message)
    }
}

// POST: Reset password
const resetPassword = async (req, res) => {
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

        const hashed = await bcrypt.hash(password.trim(), 10)

        await pool.query(
            'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = $2',
            [hashed, token]
        )

        res.json({message: "Password has been reset"})
        
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

module.exports = {authorizeUser, logout, updateAccount, updatePassword, forgotPassword, resetPassword, deleteAccount}
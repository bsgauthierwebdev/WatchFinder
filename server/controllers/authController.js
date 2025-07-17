const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
const crypto = require("crypto")
const {validationResult} = require("express-validator")
const sendEmail = require("../utils/sendEmail")
dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET || 'supersecret' 

// POST: Register new user
const registerUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {username, email, password, confirmPassword} = req.body

    if (password !== confirmPassword) {
        return res.status(400).json({error: "Passwords do not match"})
    }

    try {
        const usernameInUse = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        )

        if (usernameInUse.rows.length > 0) {
            return res.status(409).json({error: "Username already in use"})
        }

        const emailInUse = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        if (emailInUse.rows.length > 0) {
            return res.status(409).json({error: "Email already in use"})
        }

        const hashed = await bcrypt.hash(password, 10)

        const verificationToken = crypto.randomBytes(32).toString("hex")
        const verificationExpires = new Date(Date.now() + 1000 * 60 * 60)

        const newUser = await pool.query(`
                INSERT INTO users (username, email, password, is_verified, email_verification_token, email_verification_expires) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING user_id, username, email
            `,
            [username, email, hashed, false, verificationToken, verificationExpires]
        )

        const verifyLink = `http://localhost:5173/verify-email/${verificationToken}`
        await sendEmail(
            email,
            "Verify your email address",
            `
                <h2>Welcome to Watch Finder!</h2>
                <p>Please verify your email address by clicking the button below:</p>
                <a href = "${verifyLink}" style = "padding: 10px 15px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 5px;">Verify email</a>
                <p>This link will expire in 1 hour</p>
            `
        )

        // const token = jwt.sign(
        //     {user_id: newUser.rows[0].user_id},
        //     process.env.JWT_SECRET,
        //     {expiresIn: "1d"}
        // )

        // return res.status(201).json({
        //     token,
        //     user: newUser.rows[0]
        // })

        return res.status(201).json({message: "Registration successful! Please check your email to verify your account."})

    } catch (err) {
        console.error("Registration failed: ", err.message)
        res.status(500).json({error: "User registration failed"})
    }
}

// PUT: Verify new user
const verifyEmail = async (req, res) => {
    const {token} = req.params

    if (!token) {
        return res.status(400).json({error: "Verification token missing"})
    }

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email_verification_token = $1',
            [token]
        )

        const user = result.rows[0]

        if (!user) {
            return res.status(400).json({error: "Invalid or expired verification token"})
        }
        
        // console.log("Registering user ", user.username)

        if (user.is_verified) {
            return res.status(400).json({error: "Email already verified"})
        }


        const expires = new Date(user.email_verification_expires)
        if (Date.now() > expires.getTime()) {
            return res.status(400).json({error: "Verification token has expired"})
        }

        await pool.query(
            'UPDATE users SET is_verified = true, email_verification_token = NULL, email_verification_expires = NULL WHERE user_id = $1',
            [user.user_id]
        )

        res.status(200).json({message: "Email verified successfully!"})

    } catch (err) {
        console.error("Email verification failed: ", err.message)
        res.status(500).json({error: "Email verification failed"})
    }
}

// PUT: Resend verification email
const resendVerificationEmail = async (req, res) => {
    const {email} = req.body

    if (!email) {
        return res.status(400).json({error: "Email is required"})
    }    

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        const user = result.rows[0]

        if (!user) {
            return res.status(404).json({error: "No account found with that email"})
        }

        if (user.is_verified) {
            return res.status(400).json({error: "Email has already been verified"})
        }

        const newVerificationToken = crypto.randomBytes(32).toString("hex")
        const newTokenExpires = new Date(Date.now() + 1000 * 60 * 60)

        await pool.query(
            'UPDATE users SET email_verification_token = $1, email_verification_expires = $2 WHERE user_id = $3',
            [newVerificationToken, newTokenExpires, user.user_id]
        )

        const newVerificationUrl = `http://localhost:5173/verify-email/${newVerificationToken}`
        
        await sendEmail(
            email,
            "Resend - Verify your email address",
            `
                <h2>Welcome to Watch Finder!</h2>
                <p>Please verify your email address by clicking the button below:</p>
                <a href = "${newVerificationUrl}" style = "padding: 10px 15px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 5px;">Verify email</a>
                <p>This link will expire in 1 hour</p>
            `
        )

        res.status(200).json({message: "Verification email resent"})

    } catch (err) {
        console.error("Resend verification error: ", err.message)
        res.status(500).json({error: "Failed to resend verification email"})
    }
}

// POST: Login user
const loginUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    
    const {email, password} = req.body

    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        // console.log(user.rows[0])

        if (user.rows.length === 0) {
            return res.status(401).json({error: "Invalid email or password"})
        }

        const valid = await bcrypt.compare(password, user.rows[0].password)

        // console.log(valid)

        if (!valid) {
            return res.status(401).json({error: "Invalid email or password"})
        }

        const token = jwt.sign({user_id: user.rows[0].user_id}, JWT_SECRET, {expiresIn: '1h'})

        res.json({token})

    } catch (err) {
        console.error(err)
        res.status(500).json({error: "Login failed"})
    }
}

module.exports = {registerUser, verifyEmail, resendVerificationEmail, loginUser}
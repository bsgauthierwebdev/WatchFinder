const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET || 'supersecret' 

// POST: Register new user
const addUser = async (req, res) => {
    const {username, email, password} = req.body

    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    try {
        const usernameInUse = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [trimmedUsername]
        )

        if (usernameInUse.rows.length > 0) {
            return res.status(401).json({message: "Username already in use"})
        }

        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailCheck.test(trimmedEmail)) {
            return res.status(400).json({error: "Invalid email format"})
        }

        const emailInUse = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [trimmedEmail]
        )

        if (emailInUse.rows.length > 0) {
            return res.status(401).json({message: "Email already in use"})
        }

        if (trimmedPassword.length < 8) {
            return res.status(400).json({error: "Password must be at least 8 characters"})
        }

        const hashed = await bcrypt.hash(trimmedPassword, 10)
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email',
            [trimmedUsername, trimmedEmail, hashed]
        )

        return res.status(201).json(newUser.rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({error: "User registration failed"})
    }
}

// POST: Login user
const login = async (req, res) => {
    const {email, password} = req.body

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [trimmedEmail]
        )

        // console.log(user.rows[0])

        if (user.rows.length === 0) {
            return res.status(401).json({error: "Invalid email or password"})
        }

        const valid = await bcrypt.compare(trimmedPassword, user.rows[0].password)

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

module.exports = {addUser, login}
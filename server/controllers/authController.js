const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
const {validationResult} = require("express-validator")
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

        // const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        // if (!emailCheck.test(email)) {
        //     return res.status(400).json({error: "Invalid email format"})
        // }

        const emailInUse = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        if (emailInUse.rows.length > 0) {
            return res.status(409).json({error: "Email already in use"})
        }

        // if (password.length < 8) {
        //     return res.status(400).json({error: "Password must be at least 8 characters"})
        // }

        const hashed = await bcrypt.hash(password, 10)
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email',
            [username, email, hashed]
        )

        const token = jwt.sign(
            {user_id: newUser.rows[0].user_id},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

        return res.status(201).json({
            token,
            user: newUser.rows[0]
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({error: "User registration failed"})
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

module.exports = {registerUser, loginUser}
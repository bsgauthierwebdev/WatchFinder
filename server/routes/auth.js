const express = require('express')
const router = express.Router()
const {body} = require("express-validator")
const {addUser, login} = require("../controllers/authController")

// REGISTER NEW USER
router.post("/register",
    [
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required"),
        body("email")
            .trim()
            .isEmail()
            .withMessage("Valid email required"),
        body("password")
            .trim()
            .isLength({min: 8})
            .withMessage("Password must be at least 8 characters")
    ], 
    addUser
)

// LOGIN USER
router.post("/login", login)

module.exports = router
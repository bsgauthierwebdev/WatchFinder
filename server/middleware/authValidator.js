const {body} = require("express-validator")

const registerValidation = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({min: 3}).withMessage("Username must be at least 3 characters in length"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email address is required")
        .isEmail().withMessage("Please enter a valid email address"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({min: 8}).withMessage("Password must be at least 8 characters in length")
]

const loginValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email"),
    body("password")
        .notEmpty().withMessage("Password is required")
]

module.exports = {
    registerValidation,
    loginValidation
}
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
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({min: 8}).withMessage("Password must be at least 8 characters in length"),
    body("confirmPassword")
        .trim()
        .notEmpty().withMessage("Confirm password is required")
        .custom((value, {req}) => value === req.body.password)
        .withMessage("Passwords do not match")
]

const loginValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email"),
    body("password")
        .notEmpty().withMessage("Password is required")
]

const updateUsernameValidation = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({min: 3}).withMessage("Username must be at least 3 characters in length")
]

const updateEmailValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isEmail().withMessage("Please enter a valid email address")
]

const updatePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({min: 8})
        .withMessage("Password must be at least 8 characters in length"),
    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .custom((value, {req}) => value === req.body.newPassword)
        .withMessage("Passwords do not match")
]

const forgotPasswordValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email address")
]

const resetPasswordValidation = [
    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({min: 8}).withMessage("Password must be at least 8 characters in length"),
    body("confirmPassword")
        .trim()
        .notEmpty().withMessage("Confirm password is required")
        .custom((value, {req}) => value === req.body.password)
        .withMessage("Passwords do not match")
]

module.exports = {
    registerValidation,
    loginValidation,
    updateUsernameValidation,
    updateEmailValidation,
    updatePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation
}
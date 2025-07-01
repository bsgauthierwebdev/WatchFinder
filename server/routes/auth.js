const express = require('express')
const router = express.Router()
const {registerUser, verifyEmail, resendVerificationEmail, loginUser} = require("../controllers/authController")
const {registerValidation, loginValidation} = require("../middleware/authValidator")

// REGISTER NEW USER
router.post("/register", registerValidation, registerUser)

// VERIFY NEW EMAIL
router.get("/verify-email/:token", verifyEmail)

// VERIFY RESEND
router.get("/resend-verification", resendVerificationEmail)

// LOGIN USER
router.post("/login", loginValidation, loginUser)

module.exports = router
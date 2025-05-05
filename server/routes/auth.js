const express = require('express')
const router = express.Router()
const {registerUser, loginUser} = require("../controllers/authController")
const {registerValidation, loginValidation} = require("../middleware/authValidator")

// REGISTER NEW USER
router.post("/register", registerValidation, registerUser)

// LOGIN USER
router.post("/login", loginValidation, loginUser)

module.exports = router
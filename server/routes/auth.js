const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getUserInfo} = require("../controllers/authController")
const {registerValidation, loginValidation} = require("../middleware/authValidator")
const auth = require("../middleware/authMiddleware")

// REGISTER NEW USER
router.post("/register", registerValidation, registerUser)

// LOGIN USER
router.post("/login", loginValidation, loginUser)

// GET USER INFO
router.get("/me", auth, getUserInfo)

module.exports = router
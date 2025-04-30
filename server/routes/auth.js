const express = require('express')
const router = express.Router()
const {addUser, login} = require("../controllers/authController")

// REGISTER NEW USER
router.post("/register", addUser)

// LOGIN USER
router.post("/login", login)

module.exports = router
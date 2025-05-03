const express = require('express')
const router = express.Router()
const {authorizeUser, logout, updateUsername, updateEmail, updatePassword, forgotPassword, resetPassword, deleteAccount} = require("../controllers/usersController")

// DASHBOARD ROUTE
router.get("/dashboard", authorizeUser)

// LOGOUT USER
router.post("/logout", logout)

// UPDATE USERNAME
router.put("/update-username", updateUsername)

// UPDATE EMAIL
router.put("/update-email", updateEmail)

// UPDATE PASSWORD
router.put("/change-password", updatePassword)

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword)

// RESET PASSWORD
router.post("/reset-password/:token", resetPassword)

// DELETE ACCOUNT
router.delete("/delete", deleteAccount)

module.exports = router
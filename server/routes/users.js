const express = require('express')
const router = express.Router()
const upload = require("../middleware/uploadMiddleware")
const auth = require("../middleware/authMiddleware")
const {updateUsernameValidation, updateEmailValidation, updatePasswordValidation, forgotPasswordValidation, resetPasswordValidation} = require("../middleware/authValidator")
const {getUserInfo, authorizeUser, logout, updateUsername, updateEmail, updatePassword, forgotPassword, resetPassword, deleteAccount, updateProfilePic} = require("../controllers/usersController")

// GET USER INFO
router.get("/me", auth, getUserInfo)

// DASHBOARD ROUTE
router.get("/dashboard", authorizeUser)

// LOGOUT USER
router.post("/logout", logout)

// UPDATE USERNAME
router.put("/update-username", updateUsernameValidation, updateUsername)

// UPDATE EMAIL
router.put("/update-email", updateEmailValidation, updateEmail)

// UPDATE PASSWORD
router.put("/change-password", updatePasswordValidation, updatePassword)

// UPDATE PROFILE IMAGE
router.put("/update-profile-pic", upload.single("profile_img"), updateProfilePic)

// FORGOT PASSWORD
router.post("/forgot-password", forgotPasswordValidation, forgotPassword)

// RESET PASSWORD
router.post("/reset-password/:token", resetPasswordValidation, resetPassword)

// DELETE ACCOUNT
router.delete("/delete", deleteAccount)

module.exports = router
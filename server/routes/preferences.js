const express = require("express")
const router = express.Router()
const {setPrefs, getPrefs} = require("../controllers/preferencesController")
const authChain = require("../middleware/authChain");


// CREATE or UPDATE preferences
router.post('/', authChain, setPrefs)

// GET preferences for current user
router.get("/", authChain, getPrefs)

module.exports = router
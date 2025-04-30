const express = require("express")
const router = express.Router()
const {addFavorite, getFavorites, deleteFavorite} = require("../controllers/favoritesController")
const authChain = require("../middleware/authChain")


// ADD a favorite
router.post("/", authChain, addFavorite)

// GET all favorites for a user
router.get("/", authChain, getFavorites)

// DELETE a favorite
router.delete("/:listing_id", authChain, deleteFavorite)

module.exports = router
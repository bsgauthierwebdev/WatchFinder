const express = require("express")
const router = express.Router()
const {addListing, getAllListings, getSingleListing, deleteListing} = require("../controllers/listingsController")
const auth = require("../middleware/authMiddleware")

// POST - Add a new listing
router.post("/", auth, addListing)

 // GET - Get all listings (optionally filtered)
 router.get("/", getAllListings)

 // GET - Get a single listing by ID
 router.get("/:id", getSingleListing)

 // DELETE - Delete a listing
 router.delete("/:id", auth, deleteListing)

 module.exports = router
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

// Sample Route
app.get('/', (req, res) => {
    res.send('Welcome to the Watch Tracker API!')
})

// User Routes
const userRoutes = require("./routes/users")
app.use("/api/users", userRoutes)

// Preferences Routes
const prefRoutes = require("./routes/preferences")
app.use("/api/preferences", prefRoutes)

// Listings Routes
const listingsRoutes = require("./routes/listings")
app.use("/api/listings", listingsRoutes)

// Favorites Routes
const favRoutes = require("./routes/favorites")
app.use("/api/favorites", favRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
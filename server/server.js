const express = require('express')
const cors = require('cors')
require('dotenv').config()
const path = require("path")
const securityMiddleware = require("./middleware/securityMiddleware")

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow only my front-end
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
app.use(cors(corsOptions))

// Path for uploading files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Security middleware
app.use(securityMiddleware)

// Sample Route
// app.get('/', (req, res) => {
//     res.send('Welcome to the Watch Tracker API!')
// })

// Route Imports
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const prefRoutes = require("./routes/preferences")
const listingsRoutes = require("./routes/listings")
const favRoutes = require("./routes/favorites")
const matchRoutes = require("./routes/matches")

// Use Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/preferences", prefRoutes)
app.use("/api/listings", listingsRoutes)
app.use("/api/favorites", favRoutes)
app.use("/api/matches", matchRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
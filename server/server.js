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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const xss = require("xss-clean")

// Rate limiter configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP. Please try again later."
})

// Export as an array for easy integration
const securityMiddleware = [
    helmet(),
    helmet.hidePoweredBy(), // Sanitizes the X-Powered-By information
    // xss(),
    limiter
]

module.exports = securityMiddleware
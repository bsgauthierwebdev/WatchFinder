const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(401).send({error: "Please authenticate"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded // Attach user data to request

        next() // Proceed to the next middleware or route handler

    } catch (err) {
        res.status(401).send({error: "Invalid token"})
    }
}

module.exports = auth
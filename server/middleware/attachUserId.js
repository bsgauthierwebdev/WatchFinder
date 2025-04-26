function attachUserId(req, res, next) {
    if (req.user && req.user.user_id) {
        req.user_id = req.user.user_id // Attach directly
        next()
    } else {
        return res.status(401).json({error: "Unauthorized"})
    }
}

module.exports = attachUserId
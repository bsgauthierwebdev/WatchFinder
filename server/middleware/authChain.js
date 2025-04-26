const auth = require("./authMiddleware")
const attachUserId = require("./attachUserId")

// Combine auth & attachUserId into a single middleware array
const authChain = [auth, attachUserId]

module.exports = authChain
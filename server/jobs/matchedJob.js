const cron = require("node-cron")
const pool = require("../db")
const matchListingsToPreferences = require("../utils/matchLogic")

// Schedule to run every hour (adjust later as needed)
cron.schedule("0 * * * *", async () => {
    console.log("🔁 Running matched results job...")

    try {
        await matchListingsToPreferences()
        console.log("✅ Matched results updated")
    } catch (err) {
        console.error("❌ Error running matched job: ", err.message)
    }
})
const matchListingsToPreferences = require("../utils/matchLogic")

async function run() {
    try {
        console.log("Running matching logic manually...")
        await matchListingsToPreferences()
        console.log("✅ Done!")
    } catch (err) {
        console.error("❌ Error: ", err.message)
    }
}

run()
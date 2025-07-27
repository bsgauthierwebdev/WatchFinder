import fs from "fs"

// Read contents of a file
const raw = fs.readFileSync("brandList.txt", "utf8")

// Split into lines and process
const allBrands = raw
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.startsWith("•")) // Only lines that start with a bullet
    .map(line => line.replace(/^•\s*/, "")) // Remove the bullet and leading space
    .filter(Boolean) // Remove any empty lines

// Format with 8 items per line
const formattedArray = allBrands.reduce((acc, brand, idx) => {
    const quoteWrapped = `"${brand}"`
    const isLast = idx === allBrands.length - 1
    const shouldBreakLine = (idx + 1) % 8 === 0

    acc += quoteWrapped
    acc += isLast ? "" : ", "
    acc += shouldBreakLine && !isLast ? "\n " : ""

    return acc
}, "")

// Save the array to a new JS file
const output = `export const allBrands = [\n ${formattedArray}\n];\n`

fs.writeFileSync("preferenceOptions.js", output)

console.log(`✅ Extracted ${allBrands.length} brands to preferenceOptions.js`)
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Define & create uploads folder
const uploadPath = path.join(__dirname, "../uploads")

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {recursive: true})
}

// Define storage location & filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath) // local "uploads" folder
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname)
        const filename = `${Date.now()}-${file.fieldname}${ext}`
        cb(null, filename)
    }
})

// Filter for image types
const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const mimetype = file.mimetype

    if (
        [".jpg", ".jpeg", ".png"].includes(ext) &&
        allowedTypes.includes(mimetype)
    ) {
        cb(null, true)
    } else {
        cb(new Error("Only .jpg, .jpeg, .png files are allowed"), false)
    }
}

const upload = multer({storage, fileFilter, limits: {fileSize: 5 * 1024 * 1024}})

module.exports = upload
const express = require('express')
const router = express.Router();
const multer = require('multer');
const {Upload, getUploads, uploadChunk} = require("../controller/main")
const fs = require("fs")




const storage = multer.memoryStorage(); // Store chunks in memory
const upload = multer({ storage });


router.post("/upload", upload.single('chunk'),uploadChunk)
router.get('/uploads', getUploads)

module.exports = router

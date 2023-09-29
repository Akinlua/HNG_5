const express = require('express')
const router = express.Router();
const multer = require('multer');
const {Upload} = require("../controller/main")

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {      
      cb(null, './upload/'); // Destination folder for uploaded files
    },
    filename: async function (req, file, cb) { 
      cb(null,  "Video_"+ Date.now()  + '-' + file.originalname); // File naming convention
    },
  });
   
const upload = multer({ 
    storage: storage
});


router.post("/upload", upload.single('file'), Upload)
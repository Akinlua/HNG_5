const express = require('express')
const router = express.Router();
const multer = require('multer');
const {Upload} = require("../controller/main")
const fs = require("fs")

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {   
      const uploadDirectory = './public/upload/'  
       if(!fs.existsSync(uploadDirectory)){
        fs.mkdirSync(uploadDirectory, {recursive: true})
       }
      cb(null, uploadDirectory); // Destination folder for uploaded files
    },
    filename: async function (req, file, cb) {
    console.log(file.originalname) 
      cb(null,  "Video_"+ Date.now()  + '-' + file.originalname); // File naming convention
    },
  });
   
const upload = multer({ 
    storage: storage
});


router.post("/upload", upload.single('video'), Upload)

module.exports = router
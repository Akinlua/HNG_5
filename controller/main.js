const fs = require('fs');
const url = "https://hng5.akinlua.repl.co"

const deleteFile = async (filename) => {

    //delete uploaded file
    const filePath = `public/upload/${filename}`; // Replace with your file path

    // Use the fs.unlink method to delete the file
    fs.unlink(filePath, (err) => {
        if (err) {
        console.error(err);
        console.log('Error deleting the file')
        }
    })
}


const Upload = async (req, res) => {

    try{
        console.log(req.file)
        if(!req.file){
            return res.status(404).json({
                error: true,
                status: 404,
                errorMessage: "No File Found"
            })
        }

        if(req.file.mimetype != 'video/mp4' && req.file.mimetype != 'video/webm' && req.file.mimetype != 'video/mpeg' && req.file.mimetype != 'video/x-matroska'){
            await deleteFile(req.file.filename)
            return res.status(404).json({
                error: true,
                status: 400,
                errorMessage: "Make sure file is a video file"
            })
        }
        if(req.file.size > 50 * 1024 * 1024){
            await deleteFile(req.file.filename)
            return res.status(404).json({
                error: true,
                status: 400,
                errorMessage: "Make sure Video file is no more than 50MB"
            })
        }

        // Access the uploaded file details
        const { originalname, filename, path } = req.file;

        console.log(path)
        res.status(200).json({
            error: false,
            status: 200,
            Message: "File Uploaded Successfully",
            originalname, filename, 
            realPath: path,
            videoPath_src: `${url}/upload/${filename}`
        })
        // res.render("video", { originalname, filename, path})
    } catch(error) {
        console.log(error)
        if(req.file.filename){
            await deleteFile(req.file.filename)
        }
        return res.status(404).json({
            error: true,
            status: 500,
            errorMessage: "An error was found"
        })
    }
}

module.exports = {
    Upload,
}
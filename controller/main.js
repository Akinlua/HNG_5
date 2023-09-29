
const Upload = async (req, res) => {

    try{
        if(!req.file){
            return res.status(404).json({
                error: true,
                status: 404,
                errorMessage: "No File Found"
            })
        }

        if(req.file.mimetype !== 'video/mp4' || req.file.mimetype !== 'video/mpeg' ){
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

        res.status(200).json({
            error: false,
            status: 200,
            Message: "File Uploaded Successfully",
            originalname, filename, 
            videoPath: path
        })
        // res.render("video", { originalname, filename, path})
    } catch(error) {
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
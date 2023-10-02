const fs = require('fs');
const url = "https://hng5.akinlua.repl.co/"
const axios = require('axios');
const File = require("../model/File")
const apiKey = process.env.DEEPGRAM_API_KEY; // Replace with your actual Deepgram API key

const path = require("path")

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const { SpeechClient } = require('@google-cloud/speech');

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

const transcribe_to_txt = async (audioname)=>{
    return new Promise((resolve, reject) => {

        // Create a SpeechClient object with your service account key
        const speechClient = new SpeechClient({
            keyFilename: './serviceAccountKey.json', // Replace with the path to your service account key JSON file
        });

        // Path to the audio file you want to transcribe
        const audioFilePath = `../public/upload/${audioname}`; // Replace with your audio file path

        const filepath = path.join(__dirname, audioFilePath)
        // Configuration for the audio file
        const config = {
        encoding: 'MP3', // Adjust encoding based on your audio file format
        sampleRateHertz: 16000, // Adjust sample rate based on your audio
        languageCode: 'en-US', // Adjust language code as needed
        };

        // Create a request object with the audio data and configuration
        fs.readFile(filepath, (err, audioData) => {
            if(err) {
                console.error("Error Occurred: " + err)
                reject(err)
            } 
            const request = {
            audio: {
                content: audioData.toString('base64'),
            },
            config: config,
            };

            // Call the Speech-to-Text API to transcribe the speech
            speechClient
            .recognize(request)
            .then((response) => {
                const transcription = response[0].results
                .map((result) => result.alternatives[0].transcript)
                .join('\n');
                console.log('Transcription:', transcription);
                // //delete audio not needed again
                deleteFile(audioname)
                resolve(transcription)
            })
            .catch((error) => {
                console.error('Error:', error);
                reject(error)
            });
        })
    })

}

const transcribeAudio = async (videoPath, audioName) => {
    return new Promise((resolve, reject) => {
        // Output audio file path
        const audioname = `Audio_${Date.now()}_${audioName}.mp3`
        const audioPath = `./public/upload/${audioname}`;
    
        ffmpeg(videoPath)
        .audioCodec('libmp3lame')
        .audioBitrate(128)
        .toFormat('mp3')
        .on('end', () => {
            console.log('Audio extraction finished.');
            resolve(audioname)
        })
        .on('error', (err) => {
            console.error('Error:', err);
            reject(err)
        })
        .save(audioPath);
    })
    
}

//upload a whole video file, not useful again
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

        const src = `${url}/upload/${filename}`
        
        let timeout= 30 * 60 * 1000
        //delete the stored video in case of timeout for generating transcription (due to internet connection or sth)
        setTimeout( async () => {
            const findVideo = await File.findOne({filename: filename})
            if(!findVideo){
                deleteFile(req.file.filename)//delete the video after 30min Only if not found in database
            }   
        }, timeout);

        transcribeAudio(path, originalname)
            .then((audioname)=> {
                return transcribe_to_txt(audioname)
            })
            .then((transcription)=> {
                console.log('transcription: ' + transcription)
                //save to database
                const file = File.create({originalname, filename, path, src: src, transcript: transcription})
                res.status(200).json({
                    error: false,
                    status: 200,
                    Message: "File Uploaded Successfully",
                    originalname, filename, 
                    realPath: path,
                    videoPath_src: src,
                    transcript: transcription
                })
                
            })
            .catch((error) => {
                console.error('Error: ', error)
            })

        
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


const uploadChunk = async (req, res) => {
    try {
        const fileType = req.body.fileType//get the mimetype
        const chunk = req.file.buffer;
        const totalsize = parseInt(req.body.totalSize, 10);
        const start = parseInt(req.body.start, 10);
        const fileName = req.body.fileName;
    
        if(!chunk){
            return res.status(404).json({
                error: true,
                status: 404,
                errorMessage: "No chunk Found",
                complete: true
            })
        }
        if(totalsize > 50 * 1024 * 1024){
            return res.status(404).json({
                error: true,
                status: 400,
                errorMessage: "Make sure Video file is no more than 50MB",
                complete: true
            })
        }
        if(fileType != 'video/mp4' && fileType != 'video/webm' && fileType != 'video/mpeg' && fileType != 'video/x-matroska'){
            return res.status(404).json({
                error: true,
                status: 400,
                errorMessage: "Make sure file is a video file",
                complete: true
            })
        }
    
        const videoFileName =fileName; // Replace with your desired video file name
        const filepath = path.join(__dirname, `../public/upload/${videoFileName}`)
    
        const uploadDirectory = './public/upload/'  
        if(!fs.existsSync(uploadDirectory)){
            fs.mkdirSync(uploadDirectory, {recursive: true})
        }
        // // create an empty file
        // fs.openSync(filepath, 'w');
    
        // const filepath = `./public/upload/${fileName}`
        const writestream = start === 0
            ? fs.createWriteStream(filepath, {flags: 'w'})
            : fs.createWriteStream(filepath, {flags: 'a'})
    
        writestream.write(chunk, () => {
            const currentSize = start + chunk.length//check how much  has and is being proccessed
    
            if(currentSize >= totalsize){
                //end upload 
                writestream.end(() => {
                    transcribeAudio(filepath, videoFileName)
                    .then((audioname)=> {
                        return transcribe_to_txt(audioname)
                    })
                    .then((transcription)=> {
                        const src = `${url}/upload/${videoFileName}`
                        console.log('transcription: ' + transcription)
                        //save to database
                        const file = File.create({filename: videoFileName, path: filepath, src: src, transcript: transcription})
                        res.status(200).json({
                            complete:true,
                            error: false,
                            status: 200,
                            Message: "File Uploaded Successfully",
                            filename: videoFileName, 
                            Path: filepath,
                            videoPath_src: src,
                            transcript: transcription
                        })
                    
                })
                .catch((error) => {
                    console.error('Error: ', error)
                })
                })
            } else {
                //continue upload
                res.json({
                    complete: false,
                    start: currentSize
                })
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            error: true,
            status: 500,
            errorMessage: "An error waSs found"
        })
    }
    
    
}

//for retreiving all videos
const getUploads = async (req, res) => {
    const files = await File.find({}).limit(5)
    const list = []
    files.forEach(file => {
        list.push({
            src: file.src,
            transcript: file.transcript,
        })
    });
    const len_list = list.length
    res.status(200).json({
        error: false,
        status: 200,
        Message: "List of last 5 uploaded videos",
        videos: list,
        len_videos: len_list

    })
}
  


module.exports = {
    Upload,
    getUploads,
    uploadChunk,
}

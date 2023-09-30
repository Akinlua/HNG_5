# Video API

The REST API allows you to make an operation on a video form data.

## Table of Contents

1. [Introduction](#introduction)
2. [Examples](#examples)
3. [Error Responses](#error-responses)


## Introduction

The Video API provides a RESTful interface that allows a post request of a video form data and then stores the video in a disk and sends a response containing neccesary informations about the video inlcuding the video src path that can be used in the front end to display the video

## Examples
Here are some examples on how to use the API:

You can use any application such as Postman to make the requests

### Post A Video

POST /api

Content-Type: multipart/form-data

.Request:

    FormData{}

.Response:

    {
    "error": false,
    "status": 200,
    "Message": "File Uploaded Successfully",
    "originalname": "vlc-record-2022-08-13-22h48m54s-Superstore S03E03 - RMTeam, RMZ.cr-.mp4",
    "filename": "Video_1696060225889-vlc-record-2022-08-13-22h48m54s-Superstore S03E03 - RMTeam, RMZ.cr-.mp4",
    "realPath": "public/upload/Video_1696060225889-vlc-record-2022-08-13-22h48m54s-Superstore S03E03 - RMTeam, RMZ.cr-.mp4",
    "videoPath_src": "https://hng5.akinlua.repl.co//upload/Video_1696060225889-vlc-record-2022-08-13-22h48m54s-Superstore S03E03 - RMTeam, RMZ.cr-.mp4"
    }

## Error Responses

#### HTTP Status: 404 Not Found
Content-Type: application/json

If a file is not found

. Body: 

    {
        error: true,
        status: 404,
        errorMessage: "No File Found"
    }

#### HTTP Status: 400 Bad Request
Content-Type: application/json

If the file found is not a video file Only .mp4 is allowed.

. Body: 

    {
        error: true,
        status: 400,
        errorMessage: "Make sure file is a video file"
    }

If the video file is more than 50Mb which is the max size allowed for processing the video.

. Body: 

    {
        error: true,
        status: 400,
        errorMessage: "Make sure Video file is no more than 50MB"
    }

#### HTTP Status: 500 Internal Server Error
Content-Type: application/json

If there was any other error with the server, you will get the below error

.Body:

    {
        error: true,
        status: 500,
        errorMessage: "An error was found"
    }

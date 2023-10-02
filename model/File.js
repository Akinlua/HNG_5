
const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({

    originalname: {
        type: String,
    },
    filename: {
        type: String,
    },
    path: {
        type: String,
    },
    src: {
        type: String,
    },
    transcript: {
        type: String,
    }

   
}, {timestamps: true},
)

module.exports = mongoose.model('File', fileSchema)

require('dotenv').config()
const express = require("express")
const app = express()
const path = require("path")
const router = require("./routes/main")
const bodyParser = require("body-parser")
const cors = require("cors")
const connectDB = require('./db/connect')

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'))


app.use('/api', router)


app.get("/", (req,res) => {

    res.render("index")
})





const port = process.env.PORT || 3000

const start = async () => {
    try{
        //connect DB
        await connectDB()
        console.log("Connected to DB")
        app.listen(port, "0.0.0.0", console.log(`Server is listening to port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start();

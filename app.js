const express = require("express")
const app = express()
const path = require("path")
const router = require("./routes/main")
const bodyParser = require("body-parser")
const cors = require("cors")

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

port = process.env.PORT || 3000
app.listen(port, () => console.log(`App listening at port ${port}`))


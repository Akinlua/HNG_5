const express = require("express")
const app = express()

const router = require("./routes/main")
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('', router)


port = process.env.PORT || 3000
app.listen(port, () => console.log(`App listening at port ${port}`))


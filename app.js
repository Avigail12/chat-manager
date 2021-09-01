const express = require('express')
require('dotenv').config()
const messages = require('./routes/messages')

const PORT = process.env.PORT || 8080

const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/api/messages', messages)


app.listen(PORT,(req,res) => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
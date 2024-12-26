require('dotenv').config();

const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./auth')
const http = require('http');
const socket = require('./socket');
const path = require('path')

const app = express()
const server = http.createServer(app)
const port = process.env.PORT

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(logger)

app.use('/media', express.static(path.join(__dirname, 'public')));

function logger(req, _, next) {
    console.warn(new Date(), req.url)
    next()
}

auth.init(app)
socket.init(server)

server.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
})
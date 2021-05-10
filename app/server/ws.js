const server = require('http')
const app = require('express')()
const io = require('socket.io')(server)

server.createServer(app)

io.on('connection', (socket) => {})

module.exports = {
  app,
  server,
}

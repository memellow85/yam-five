const server = require('http')
const app = require('express')()
const io = require('socket.io')(server)

server.createServer(app)

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    const user = usersDB.getUser(socket.id)
    if (user) {
      const { room } = user
      usersDB.removeUser(id)
      socket.leave(room)
      // io.to(room).emit('updateUsers', usersDB.getUsersByRoom(room))
    }
  })
})

module.exports = {
  app,
  server,
}

const sslRedirect = require('heroku-ssl-redirect')
const express = require('express')
const app = express()
// eslint-disable-next-line import/order
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server, {
  upgradeTimeout: 50000,
})

const Rooms = require('../models/Room')()
const yamfive = require('./api/yamfive')

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
  )
  next()
})

app.use(sslRedirect.default())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/yam-five', yamfive)

const leftRoom = (id, socket) => {
  const user = Rooms.GETUser(id)
  if (user) {
    Rooms.DELETEUser(id)
    socket.leave(user.room)
    let usersUpdateTurn = null
    const usersIntoRoom = Rooms.GETUsersRoom(user.room)
    if (usersIntoRoom.length === 0) {
      Rooms.DELETERoom(user.room)
    } else {
      // TODO verificare controllo
      usersUpdateTurn = Rooms.GETNextTurnOnUser(user.room)
    }
    io.to(user.room).emit('leftRoomSocketEmit', {
      user: user.user,
      users: usersUpdateTurn || usersIntoRoom,
    })
  }
}

io.on('connection', (socket) => {
  socket.on('add_user', (user, cb) => {
    let callback
    const u = {
      ...user,
      id: user.user.uid,
      socket: socket.id,
      turnOn: false,
      tot: 0,
    }
    const r = {
      name: user.room,
      type: user.type,
      match: user.match,
      active: false,
    }
    const room = Rooms.GETRoom(user.room)
    if (user.method === 'create') {
      if (room) {
        callback = { error: '100' }
      } else {
        Rooms.POSTRoom(r)
        Rooms.POSTUser(u)
        callback = u
      }
    } else if (room && room.active) {
      callback = { error: '200' }
    } else if (room && !room.active) {
      const usersIntoRoom = Rooms.GETUsersRoom(user.room)
      u.type = usersIntoRoom[0].type
      u.match = usersIntoRoom[0].match
      Rooms.POSTUser(u)
      callback = u
    } else {
      callback = { error: '300' }
    }
    cb(callback)
  })

  socket.on('join_room', (user) => {
    socket.join(user.room)
    let usersIntoRoom = Rooms.GETUsersRoom(user.room)
    if (usersIntoRoom.length === 1) {
      Rooms.PUTUser(user.id)
      const newUser = {
        ...user,
        turnOn: true,
        order: 1,
      }
      usersIntoRoom = Rooms.GETUsersRoom(user.room)
      io.to(user.room).emit('joinRoomSocketEmit', {
        user: newUser,
        users: usersIntoRoom,
      })
    } else {
      io.to(user.room).emit('joinRoomSocketEmit', usersIntoRoom)
    }
  })

  socket.on('start_game', (user) => {
    Rooms.PUTRoom(user.room)
    Rooms.defineOrderUsers(user.room)
    const usersIntoRoom = Rooms.GETUsersRoom(user.room)
    io.to(user.room).emit('startGameSocketEmit', {
      user,
      users: usersIntoRoom,
    })
  })

  socket.on('update_game', (user) => {
    Rooms.PUTRoomUsers(user.room, user.type)
    const usersIntoRoom = Rooms.GETUsersRoom(user.room)
    io.to(user.room).emit('updateGameSocketEmit', usersIntoRoom)
  })

  socket.on('finish_turn', (user, cb) => {
    Rooms.PUTTurnUsers(user)
    const usersIntoRoom = Rooms.GETUsersRoom(user.room)
    const userTurn = Rooms.GETTurnOnUser(user.room)
    const callback = {
      userTurn: userTurn ? userTurn.user : null,
      usersIntoRoom,
    }
    cb(callback)
  })

  socket.on('finish_game', (user) => {
    if (Rooms.checkFinishGame(user.room)) {
      const championshipList = Rooms.GETChampionShipRoom(user.room)
      championshipList.map((u) => {
        io.to(u.socket).emit('finishGameSocketEmit', championshipList)
      })
    }
  })

  socket.on('left_room', (user) => {
    leftRoom(user.id, socket)
  })

  socket.on('error', (err) => {
    io.emit('socketErrorEmit', err)
    // leftRoom(socket.id, socket)
  })

  /* socket.on('disconnect', () => {
    console.log(Rooms.users, Rooms.rooms)
    // io.emit('socketDisconnectEmit', null)
    // leftRoom(socket.id, socket)
  }) */
})

module.exports = {
  app,
  server,
}

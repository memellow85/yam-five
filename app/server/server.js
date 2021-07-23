const express = require('express')
const app = express()
// eslint-disable-next-line import/order
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)

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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/yam-five', yamfive)

const leftRoom = (id, socket) => {
  const user = Rooms.GETUser(id)
  if (user) {
    Rooms.DELETEUser(id)
    socket.leave(user.room)
    const users = Rooms.GETUsersRoom(user.room)
    io.to(user.room).emit('updateUsersSocketEmit', users)
    io.to(user.room).emit('userLeaveMatchSocketEmit', user)
    if (users.length === 0) {
      Rooms.DELETERoom(user.room)
    }
  }
}

io.on('connection', (socket) => {
  socket.on('add_user', (user, cb) => {
    const u = {
      ...user,
      id: socket.id,
      turnOn: false,
      tot: 0,
      num: 0,
      extra: 0,
    }
    const r = {
      name: user.room,
      type: user.type,
      match: user.match,
      active: false,
    }
    const room = Rooms.GETRoom(user.room)
    let callback = null
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
      io.to(user.room).emit('updateUserSocketEmit', {
        ...user,
        turnOn: true,
        order: 1,
      })
      usersIntoRoom = Rooms.GETUsersRoom(user.room)
      io.to(user.room).emit('updateUsersSocketEmit', usersIntoRoom)
    } else {
      io.to(user.room).emit('updateUsersSocketEmit', usersIntoRoom)
    }
    io.to(user.id).emit('redirectHome')
  })

  socket.on('start_game', (user) => {
    Rooms.PUTRoom(user.room)
    Rooms.defineOrderUsers(user.room)
    io.to(user.room).emit(
      'updateUsersSocketEmit',
      Rooms.GETUsersRoom(user.room)
    )
    socket.to(user.room).emit('startGameSocketEmit', user)
  })

  socket.on('update_game', (user) => {
    let usersIntoRoom = Rooms.GETUsersRoom(user.room)
    Rooms.PUTRoomUsers(usersIntoRoom, user.type)
    usersIntoRoom = Rooms.GETUsersRoom(user.room)
    io.to(user.room).emit('updateUsersSocketEmit', usersIntoRoom)
  })

  socket.on('finish_turn', (user) => {
    Rooms.PUTChampionShipRoom(user)
    Rooms.PUTTurnUsers(user.room)
    io.to(user.room).emit(
      'updateUsersSocketEmit',
      Rooms.GETUsersRoom(user.room)
    )
    io.to(user.room).emit(
      'setUserTurnSocketEmit',
      Rooms.GETTurnOnUser(user.room)
    )
  })

  socket.on('finish_game', (user) => {
    let count = 0
    if (Rooms.checkFinishGame(user.room)) {
      const championshipList = Rooms.GETChampionShipRoom(user.room)
      championshipList.map((u) => {
        io.to(u.id).emit('winnerIsSocketEmit', {
          count,
          name: championshipList[0].user.name,
          user,
        })
        io.to(u.id).emit('newGameSocketEmit', u.turnOn)
        count++
      })
    }
  })

  socket.on('left_room', () => {
    leftRoom(socket.id, socket)
  })

  socket.on('disconnect', () => {
    leftRoom(socket.id, socket)
  })
})

module.exports = {
  app,
  server,
}

class Rooms {
  constructor() {
    this.users = []
    this.rooms = []
  }

  // USER
  GETUser(id) {
    return this.users.find((user) => user.id === id)
  }

  POSTUser(user) {
    this.users = [...this.users, user]
  }

  DELETEUser(id) {
    this.users = this.users.filter((user) => user.id !== id)
  }

  PUTUser(id) {
    this.users = this.users.map((v) => {
      if (v.id === id) {
        v.turnOn = true
        v.order = 1
      }
      return v
    })
  }

  GETUsersRoom(room) {
    return this.users.filter((user) => user.room === room)
  }

  // ROOM
  GETRoom(name) {
    return this.rooms.find((room) => room.name === name)
  }

  POSTRoom(room) {
    this.rooms = [...this.rooms, room]
  }

  PUTRoom(name) {
    this.rooms = this.rooms.map((v) => {
      if (v.name === name) {
        v.active = true
      }
      return v
    })
  }

  DELETERoom(name) {
    this.rooms = this.rooms.filter((room) => room.name !== name)
  }

  // OTHER
  GETChampionShipRoom(room) {
    return this.users
      .filter((u) => u.room === room)
      .sort((a, b) => b.tot - a.tot)
  }

  PUTChampionShipRoom(user) {
    this.users = this.users.map((v) => {
      if (v.id === user.id) {
        v.tot = user.tot
        v.num = user.num
        v.extra = user.extra
      }
      return v
    })
  }

  PUTTurnUsers(room) {
    let index = null
    this.users = this.users.map((v, k) => {
      if (v.turnOn && v.room === room) {
        index = k + 1
        v.turnOn = false
        v.match = v.match - 1
      }
      return v
    })
    if (this.users[index]) {
      this.users[index].turnOn = true
    } else {
      this.users[0].turnOn = true
    }
  }

  GETTurnOnUser(room) {
    return this.users.find((user) => user.room === room && user.turnOn)
  }

  defineOrderUsers(room) {
    let position = 1
    this.users = this.users.map((v) => {
      if (!v.turnOn && v.room === room) {
        position++
        v.order = position
      }
      return v
    })
  }

  checkFinishGame(room) {
    return (
      this.users.filter((u) => u.room === room).length ===
      this.users.filter((u) => u.match === 0 && u.room === room).length
    )
  }

  /*
  resetAllUsers(room) {
    this.users = this.users.map((v, k) => {
      if (v.room === room) {
        v.yourTurn = v.order_id === 1
        v.match = v.reinitMatch
        v.tot = 0
        v.num = 0
        v.extra = 0
      }
      return v
    })
  }
  */
}

module.exports = () => {
  return new Rooms()
}

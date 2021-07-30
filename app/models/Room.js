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

  PUTRoomUsers(users, type) {
    this.users = this.users.map((v) => {
      let match = 52
      switch (type) {
        case 'short':
          match = 26
          break
        case 'veryshort':
          match = 13
          break
      }
      v.match = match
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
    let indexNew = null
    let indexOld = null

    const usersRoom = this.users.filter((v) => v.room === room)
    usersRoom.map((v, k) => {
      if (v.turnOn) {
        indexOld = k
        const key = k + 1
        indexNew = usersRoom[key] ? key : 0
      }
      return v
    })

    if (usersRoom.length > 1) {
      this.users = this.users.map((v) => {
        if (usersRoom[indexOld].id === v.id && v.room === room) {
          v.turnOn = false
          v.match = v.match - 1
        }
        if (usersRoom[indexNew].id === v.id && v.room === room) {
          v.turnOn = true
        }
        return v
      })
    } else {
      this.users = this.users.map((v) => {
        if (usersRoom[0].id === v.id && v.room === room) {
          v.turnOn = true
          v.match = v.match - 1
        }
        return v
      })
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
}

module.exports = () => {
  return new Rooms()
}

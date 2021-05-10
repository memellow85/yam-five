class Room {
  constructor() {
    this.users = []
  }

  getUser(id) {
    return this.users.find((user) => user.id === id)
  }

  addUser(user) {
    this.users = [...this.users, user]
  }

  removeUser(id) {
    this.users = this.users.filter((user) => user.id !== id)
  }

  getRoom(room) {
    return this.users.filter((user) => user.room === room)
  }

  getChampionShipRoom(room) {
    return this.users
      .filter((u) => u.room === room)
      .sort((a, b) => b.tot - a.tot)
  }

  /* updateUser(id) {
    this.users = this.users.map((v) => {
      if (v.id === id) {
        v.yourTurn = true
        v.order_id = 1
      }
      return v
    })
  }

  updateGlobalTotalUser(user) {
    this.users = this.users.map((v) => {
      if (v.id === user.id) {
        v.tot = user.tot
        v.num = user.num
        v.extra = user.extra
      }
      return v
    })
  }

  defineOrderUsers(room) {
    let position = 1
    this.users = this.users.map((v) => {
      if (!v.yourTurn && v.room === room) {
        position++
        v.order_id = position
      }
      return v
    })
  }

  updateTurnUsers(room) {
    let index = null
    this.users = this.users.map((v, k) => {
      if (v.yourTurn && v.room === room) {
        index = k + 1
        v.yourTurn = false
        v.match = v.match - 1
      }
      return v
    })
    if (this.users[index]) {
      this.users[index].yourTurn = true
    } else {
      this.users[0].yourTurn = true
    }
  }

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

  getUserTurnOn(room) {
    return this.users.find((user) => user.room === room && user.yourTurn)
  }

  checkFinishGame(room) {
    return (
      this.users.filter((u) => u.room === room).length ===
      this.users.filter((u) => u.match === 0 && u.room === room).length
    )
  }
  */
}

module.exports = () => {
  return new Room()
}

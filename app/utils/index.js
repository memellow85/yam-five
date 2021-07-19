export const getRandomNumberCube = () => Math.floor(Math.random() * 6) + 1

export const logger = (message, data, type) => {
  if (process.env.NUXT_ENV_APP_LOG === 'true') {
    switch (type) {
      case 'i':
        console.info(message, data)
        break
      case 'e':
        console.error(message, data)
        break
      case 'w':
        console.warn(message, data)
        break
      default:
        console.log(message, data)
    }
  }
}

export const calculateActualGame = (data, dices, minMax) => {
  /**
   * Raggruppo dadi per capire se può esserci un full o poker o yam
   */
  const groupArrayByKey = (data) => {
    const tmp = []
    data.map((v) => {
      if (!tmp.includes(v.value)) {
        tmp.push(v.value)
      }
      return true
    })
    return tmp
  }

  /* const getSum = (data, value) => {
    data.map((v) => {
      value += v.value
      return true
    })
    return value
  } */

  const arrayValue = []
  Object.keys(dices).map((v) => {
    if (dices[v].value) {
      arrayValue.push(dices[v])
    }
    return true
  })

  const arrayUnique = groupArrayByKey(arrayValue)
  const scale = arrayUnique
    .sort((a, b) => (a > b ? 1 : b > a ? -1 : 0))
    .toString()
  const scaleUp = [2, 3, 4, 5, 6].toString()
  const scaleDown = [1, 2, 3, 4, 5].toString()

  let value = 0
  switch (data.name) {
    case 'one':
    case 'two':
    case 'three':
    case 'four':
    case 'five':
    case 'six':
      Object.keys(dices)
        .filter((v) => v !== 'tot')
        .map((k) => {
          switch (data.name) {
            case 'one':
              if (dices[k].value === 1) {
                value += 1
              }
              break
            case 'two':
              if (dices[k].value === 2) {
                value += 2
              }
              break
            case 'three':
              if (dices[k].value === 3) {
                value += 3
              }
              break
            case 'four':
              if (dices[k].value === 4) {
                value += 4
              }
              break
            case 'five':
              if (dices[k].value === 5) {
                value += 5
              }
              break
            case 'six':
              if (dices[k].value === 6) {
                value += 6
              }
              break
          }
          return true
        })
      break
    case 'mineleven':
      value = dices.tot <= 11 ? dices.tot : 0
      break
    case 'poker':
      if (arrayUnique.length === 2) {
        if (arrayValue.filter((v) => v.value === arrayUnique[0]).length === 4) {
          value = arrayUnique[0] * 4
        } else if (
          arrayValue.filter((v) => v.value === arrayUnique[1]).length === 4
        ) {
          value = arrayUnique[1] * 4
        } else {
          value = 0
        }
      } else if (arrayUnique.length === 1) {
        value = arrayUnique[0] * 4
      } else {
        value = 0
      }
      break
    case 'full':
      if (arrayUnique.length === 2) {
        if (
          (arrayValue.filter((v) => v.value === arrayUnique[0]).length === 2 &&
            arrayValue.filter((v) => v.value === arrayUnique[1]).length ===
              3) ||
          (arrayValue.filter((v) => v.value === arrayUnique[0]).length === 3 &&
            arrayValue.filter((v) => v.value === arrayUnique[1]).length === 2)
        ) {
          value = dices.tot
        } else {
          value = 0
        }
      } else {
        value = 0
      }
      break
    case 'scale':
      if (scale === scaleUp || scale === scaleDown) {
        value = dices.tot
      } else {
        value = 0
      }
      break
    case 'min':
      if (minMax.value !== '-' && dices.tot < minMax.value) {
        value = dices.tot
      } else if (minMax.value === '-') {
        value = dices.tot
      } else {
        value = 0
      }
      break
    case 'max':
      if (minMax.value !== '-' && dices.tot > minMax.value) {
        value = dices.tot
      } else if (minMax.value === '-') {
        value = dices.tot
      } else {
        value = 0
      }
      break
    case 'yam':
      value = arrayUnique.length === 1 ? dices.tot : 0
      break
  }

  return value
}

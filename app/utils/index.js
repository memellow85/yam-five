import cloneDeep from 'lodash/cloneDeep'
import { dicesTypesCabled } from '~/lists'

export const generateRandomRoom = (length) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const keyApp = 'yamfive_'

export const getLocalStorageKey = (key) => {
  return localStorage.getItem(`${keyApp}${key}`)
}

export const setLocalStorageKey = (key, value) => {
  return localStorage.setItem(`${keyApp}${key}`, value)
}

export const isProd = () => {
  return (
    process.env.NUXT_ENV_NODE_ENV === 'production' ||
    process.env.NUXT_ENV_NODE_ENV === 'beta'
  )
}

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

const returnArrayValue = (dices) => {
  const arrayValue = []
  Object.keys(dices).map((v) => {
    if (dices[v].value) {
      arrayValue.push(dices[v])
    }
    return true
  })
  return arrayValue
}

const isScale = (arrayUnique) => {
  const scaleUp = [2, 3, 4, 5, 6].toString()
  const scaleDown = [1, 2, 3, 4, 5].toString()
  const scale = arrayUnique
    .sort((a, b) => (a > b ? 1 : b > a ? -1 : 0))
    .toString()

  return scale === scaleUp || scale === scaleDown
}

const isFull = (arrayUnique, arrayValue) => {
  return (
    arrayUnique.length === 2 &&
    ((arrayValue.filter((v) => v.value === arrayUnique[0]).length === 2 &&
      arrayValue.filter((v) => v.value === arrayUnique[1]).length === 3) ||
      (arrayValue.filter((v) => v.value === arrayUnique[0]).length === 3 &&
        arrayValue.filter((v) => v.value === arrayUnique[1]).length === 2))
  )
}

const isPoker = (arrayUnique, arrayValue) => {
  return (
    arrayUnique.length === 2 &&
    (arrayValue.filter((v) => v.value === arrayUnique[0]).length === 4 ||
      arrayValue.filter((v) => v.value === arrayUnique[1]).length === 4)
  )
}

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

export const trace = (start, performance, key, log) => {
  if (isProd()) {
    if (start) {
      const l = performance.trace(key)
      l.start()
      return l
    } else {
      log.stop()
    }
  }
}

export const setStatisticsDice = (statistics, dices) => {
  const tmpStatistics = cloneDeep(statistics)
  dicesTypesCabled.map((k) => {
    switch (dices[k].value) {
      case 1:
        tmpStatistics.one += 1
        break
      case 2:
        tmpStatistics.two += 1
        break
      case 3:
        tmpStatistics.three += 1
        break
      case 4:
        tmpStatistics.four += 1
        break
      case 5:
        tmpStatistics.five += 1
        break
      case 6:
        tmpStatistics.six += 1
        break
    }
  })

  if (dices.tot <= 11) {
    tmpStatistics.mineleven += 1
  }

  const arrayValue = returnArrayValue(dices)
  const arrayUnique = groupArrayByKey(arrayValue)

  if (isFull(arrayUnique, arrayValue)) {
    tmpStatistics.full += 1
  }

  if (isPoker(arrayUnique, arrayValue)) {
    tmpStatistics.poker += 1
  }

  if (isScale(arrayUnique)) {
    tmpStatistics.scale += 1
  }

  if (arrayUnique.length === 1) {
    tmpStatistics.yam += 1
  }

  return tmpStatistics
}

export const calculateActualGame = (data, dices, minMax) => {
  const arrayValue = returnArrayValue(dices)
  const arrayUnique = groupArrayByKey(arrayValue)

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
      value = isFull(arrayUnique, arrayValue) ? dices.tot : 0
      break
    case 'scale':
      value = isScale(arrayUnique) ? dices.tot : 0
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

export const toDateTime = (secs) => {
  const t = new Date(1970, 0, 1)
  t.setSeconds(secs)
  return t
}

export const formatDate = (date) => {
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  return `${da}-${mo}-${ye}`
}

export const play = (file) => {
  if (getLocalStorageKey('sound') !== 'no') {
    file.play()
  }
}

export const dicesTypesCabled = ['one', 'two', 'three', 'four', 'five']

export const gamesTypesCabled = ['up', 'free', 'dry', 'down']

export const orderCharts = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'mineleven',
  'full',
  'poker',
  'scale',
  'yam',
]

export const probablyExitNumbers = {
  one: 0,
  two: 0,
  three: 0,
  four: 0,
  five: 0,
  six: 0,
  mineleven: 0,
  full: 0,
  poker: 0,
  scale: 0,
  yam: 0,
}

const dice = () => {
  return {
    value: null,
    block: false,
    name: '',
    // total: null,
  }
}

export const dices = {
  one: dice(),
  two: dice(),
  three: dice(),
  four: dice(),
  five: dice(),
  tot: null,
}

const getSingleMatch = (name) => {
  return {
    value: '-',
    name,
    label: `game.${name}`,
    active: false,
  }
}

const getGame = () => {
  return {
    one: getSingleMatch('one'),
    two: getSingleMatch('two'),
    three: getSingleMatch('three'),
    four: getSingleMatch('four'),
    five: getSingleMatch('five'),
    six: getSingleMatch('six'),
    min: getSingleMatch('min'),
    max: getSingleMatch('max'),
    mineleven: getSingleMatch('mineleven'),
    full: getSingleMatch('full'),
    poker: getSingleMatch('poker'),
    scale: getSingleMatch('scale'),
    yam: getSingleMatch('yam'),
  }
}

export const match = () => {
  return {
    down: {
      icon: 'sort-bool-ascending-variant',
      data: getGame(),
      bonusMinMax: null,
      bonusNumber: null,
    },
    free: {
      icon: 'order-bool-ascending-variant',
      data: getGame(),
      bonusMinMax: null,
      bonusNumber: null,
    },
    dry: {
      icon: 'target',
      data: getGame(),
      bonusMinMax: null,
      bonusNumber: null,
    },
    up: {
      icon: 'sort-bool-descending-variant',
      data: getGame(),
      bonusMinMax: null,
      bonusNumber: null,
    },
  }
}

export const playedListCabled = [
  {
    id: 1,
    name: 'down',
    icon: 'sort-bool-ascending-variant',
    selected: true,
    view: ['all', 'short'],
  },
  {
    id: 2,
    name: 'free',
    icon: 'order-bool-ascending-variant',
    selected: false,
    view: ['all', 'short', 'veryshort'],
  },
  {
    id: 3,
    name: 'dry',
    icon: 'target',
    selected: false,
    view: ['all'],
  },
  {
    id: 4,
    name: 'up',
    icon: 'sort-bool-descending-variant',
    selected: false,
    view: ['all'],
  },
]

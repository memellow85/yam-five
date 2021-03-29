export const dicesTypesCabled = ['one', 'two', 'three', 'four', 'five']

export const gamesTypesCabled = ['up', 'free', 'dry', 'down']

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

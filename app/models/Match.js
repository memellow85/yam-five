import Game from './Game'

export default class Match {
  constructor() {
    this.down = {
      icon: 'sort-bool-ascending-variant',
      data: new Game(),
      bonusMinMax: null,
      bonusNumber: null,
    }
    this.free = {
      icon: 'order-bool-ascending-variant',
      data: new Game(),
      bonusMinMax: null,
      bonusNumber: null,
    }
    this.dry = {
      icon: 'target',
      data: new Game(),
      bonusMinMax: null,
      bonusNumber: null,
    }
    this.up = {
      icon: 'sort-bool-descending-variant',
      data: new Game(),
      bonusMinMax: null,
      bonusNumber: null,
    }
  }
}

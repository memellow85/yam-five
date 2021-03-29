import Games from './Games'

export default class Match {
  constructor() {
    const played = new Games()

    this.down = {
      icon: 'sort-bool-ascending-variant',
      data: played.getGame(),
      bonusMinMax: null,
      bonusNumber: null,
    }
    this.free = {
      icon: 'order-bool-ascending-variant',
      data: played.getGame(),
      bonusMinMax: null,
      bonusNumber: null,
    }
    this.dry = {
      icon: 'target',
      data: played.getGame(),
      bonusMinMax: null,
      bonusNumber: null,
    }
    this.up = {
      icon: 'sort-bool-descending-variant',
      data: played.getGame(),
      bonusMinMax: null,
      bonusNumber: null,
    }
  }
}

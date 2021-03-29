import Game from './Game'

export default class Games {
  constructor() {
    this.one = new Game('uno', 'one')
    this.two = new Game('due', 'two')
    this.three = new Game('tre', 'three')
    this.four = new Game('quattro', 'four')
    this.five = new Game('cinque', 'five')
    this.six = new Game('sei', 'six')
    this.min = new Game('min', 'min')
    this.max = new Game('max', 'max')
    this.mineleven = new Game('<= 11', 'mineleven')
    this.full = new Game('full', 'full')
    this.poker = new Game('poker', 'poker')
    this.scale = new Game('scala', 'scale')
    this.yam = new Game('yamfive', 'yam')
  }

  getGame() {
    return [
      this.one,
      this.two,
      this.three,
      this.four,
      this.five,
      this.six,
      this.min,
      this.max,
      this.mineleven,
      this.full,
      this.poker,
      this.scale,
      this.yam,
    ]
  }
}

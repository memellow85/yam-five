import Dice from './Dice'

export default class Dices {
  constructor() {
    this.one = new Dice()
    this.two = new Dice()
    this.three = new Dice()
    this.four = new Dice()
    this.five = new Dice()
    this.tot = null
  }
}

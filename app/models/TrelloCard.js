class TrelloCard {
  constructor() {
    this.name = ''
    this.desc = ''
    this.idLabels = []
  }

  NormalizePOSTCard(data) {
    return {
      name: `${
        data.type.charAt(0).toUpperCase() + data.type.slice(1)
      } - YamFive`,
      desc: data.desc,
      idLabels:
        data.type === 'bug'
          ? [process.env.NUXT_ENV_ID_LABEL_BUGFIX]
          : [process.env.NUXT_ENV_ID_LABEL_CREATE],
    }
  }
}

module.exports = () => {
  return new TrelloCard()
}

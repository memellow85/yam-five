const TrelloCard = require('../../models/TrelloCard')()

export const state = () => ({})

export const mutations = {}

export const actions = {
  openCard({ state }, data) {
    this.$axios.post(
      `${process.env.NUXT_ENV_BASE_URL_TRELLO}/cards?idList=${process.env.NUXT_ENV_ID_LIST_TRELLO}&key=${process.env.NUXT_ENV_KEY_TRELLO}&token=${process.env.NUXT_ENV_TOKEN_TRELLO}`,
      TrelloCard.NormalizePOSTCard(data)
    )
  },
}

export default async ({ store }) => {
  const workbox = await window.$workbox

  if (!workbox) {
    store.commit('setWorkbox', 'not workbox')
    console.debug("Workbox couldn't be loaded.")
    return
  }

  console.log('workbox', workbox)
  store.commit('setWorkbox', 'start')

  workbox.addEventListener('installed', (event) => {
    console.log('installed', event)
    if (event.isUpdate) {
      console.log('installed isUpdate')
      store.commit('setWorkbox', 'installed isUpdate')
      /* store.commit('game/toggleNotification', {
        type: 'warning',
        message: 'New version available... Update now!!',
        buttonRefresh: true,
      }) */
    } else {
      store.commit('setWorkbox', 'installed not isUpdate')
    }
    /* if (!event.isUpdate) {
      console.debug('The PWA is on the latest version.')
      return
    }

    console.debug('There is an update for the PWA, reloading...')
    window.location.reload() */
  })
}

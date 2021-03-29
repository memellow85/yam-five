export default async ({ $store }) => {
  const workbox = await window.$workbox

  if (!workbox) {
    console.debug("Workbox couldn't be loaded.")
    return
  }

  workbox.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      $store.commit('game/toggleNotification', {
        type: 'warning',
        message: 'New version available... Update now!!',
        buttonRefresh: true,
      })
    }
    /* if (!event.isUpdate) {
      console.debug('The PWA is on the latest version.')
      return
    }

    console.debug('There is an update for the PWA, reloading...')
    window.location.reload() */
  })
}

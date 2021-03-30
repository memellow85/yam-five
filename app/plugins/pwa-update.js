export default async ({ store }) => {
  const workbox = await window.$workbox

  if (!workbox) {
    console.debug("Workbox couldn't be loaded.")
    return
  }

  console.log('workbox', workbox)

  workbox.addEventListener('installed', (event) => {
    console.log('installed', event)
    if (event.isUpdate) {
      console.log('installed isUpdate')
      store.commit('game/toggleNotification', {
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

  workbox.addEventListener('message', (event) => {
    console.log('message', event)
  })

  workbox.addEventListener('waiting', (event) => {
    console.log('waiting', event)
    if (event.isUpdate) {
      console.log('waiting isUpdate')
    }
  })

  workbox.addEventListener('controlling', (event) => {
    console.log('controlling', event)
    if (event.isUpdate) {
      console.log('controlling isUpdate')
    }
  })

  workbox.addEventListener('activated', (event) => {
    console.log('activated', event)
    if (event.isUpdate) {
      console.log('activated isUpdate')
    }
  })

  workbox.addEventListener('redundant', (event) => {
    console.log('redundant', event)
    if (event.isUpdate) {
      console.log('redundant isUpdate')
    }
  })
}

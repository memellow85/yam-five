const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const config = require('../../nuxt.config.js')
const { app, server } = require('./server')
require('dotenv').config()

config.dev = process.env.NUXT_ENV_NODE_ENV !== 'production'

async function start() {
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(nuxt.render)

  server.listen(port, () => {
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true,
    })
  })
}

start()

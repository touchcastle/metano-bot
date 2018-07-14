require('dotenv').config({})
const momoka = require('momoka-core-bot')


const strategies = require('./strategy/index')
const _config = require('./config')

momoka(_config, strategies).then((bot) => {
  bot.start()
  bot.addLineBot('/line2', {
    ..._config,
    line: {
      id: process.env.LINE_CHANNEL_ID_2,
      secret: process.env.LINE_CHANNEL_SECRET_2,
      token: process.env.LINE_CHANNEL_TOKEN_2
    }
  })
})
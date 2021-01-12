require('dotenv').config({})
const momoka = require('momoka-core-bot')


const strategies = require('./strategy/index')
const _config = require('./config')
const airportNotifier = require('./notifier/airport')

momoka(_config, strategies).then(async (bot) => {

  const createConnection = require('./connection')
  await createConnection()
  bot.start()
  bot.addLineBot('/line2', {
    ..._config,
    line: {
      id: process.env.LINE_CHANNEL_ID_2,
      secret: process.env.LINE_CHANNEL_SECRET_2,
      token: process.env.LINE_CHANNEL_TOKEN_2
    }
  })
  bot.addLineBot('/line3', {
    ..._config,
    line: {
      id: process.env.LINE_CHANNEL_ID_3,
      secret: process.env.LINE_CHANNEL_SECRET_3,
      token: process.env.LINE_CHANNEL_TOKEN_3
    }
  }) 

  //cron
  var CronJob = require('cron').CronJob;
  // (sec min hr day month year)
  //new CronJob('0 2 * * * *', function() {
    new CronJob('0 6 * * * *', function() {
    airportNotifier()
    //console.log('do noti')
  }, null, true, 'America/Los_Angeles');

})
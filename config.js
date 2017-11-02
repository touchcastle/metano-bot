require('dotenv').config({})
const throwConfigError = (name) => { throw new Error(name) }
const config = {
  //shortcutRegex: /(^[a-zA-Z]{5}\s[a-zA-Z]{4}$)|(^[a-zA-Z]{3}\s[a-zA-Z]{4}$)|(^[a-zA-Z]{4}\s[a-zA-Z]{4}$)|^.+/,
  shortcutRegex: /^.+/,
  port: process.env.PORT || 2525,
  botName: process.env.BOT_NAME || 'โมโมกะ',
  domain: process.env.DOMAIN || throwConfigError('Bot domain is undefined'),
  facebook: {
    pageToken: process.env.FACEBOOK_PAGE_TOKEN
  },
  line: {
    id: process.env.LINE_CHANNEL_ID,
    secret: process.env.LINE_CHANNEL_SECRET,
    token: process.env.LINE_CHANNEL_TOKEN
  },
  ICAO_API_KEY: process.env.ICAO_API_KEY
}

module.exports = config

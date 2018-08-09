const airport = require('./airports.strategy')
const follow = require('./follow.strategy')
const chart = require('./chart.strategy')
const aloft = require('./aloft.strategy')
const radar = require('./radar.strategy')
const text = require('./text.strategy')
const location = require('./location.strategy')
//const curex = require('./curex.strategy')
const admin = require('./admin.strategy')

module.exports = [
  airport.metarStrategy,
  airport.tafStrategy,
  airport.notamStrategy,
  follow.followStrategy,
  follow.unfollowStrategy,
  admin.tableStrategy,
  text.howtoStrategy,
  text.idStrategy,
  airport.infoStrategy,
  chart.chartStrategy,
  aloft.aloftStrategy,
  radar.radarStrategy,
  location.locationStrategy,
  //curex.curexStrategy,
  text.errorStrategy,
]

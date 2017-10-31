const airport = require('./airports.strategy')
const chart = require('./chart.strategy')
const aloft = require('./aloft.strategy')
const radar = require('./radar.strategy')
const text = require('./text.strategy')

module.exports = [
  airport.metarStrategy,
  airport.tafStrategy,
  airport.notamStrategy,
  text.howtoStrategy,
  airport.infoStrategy,
  chart.chartStrategy,
  aloft.aloftStrategy,
  radar.radarStrategy,
  text.errorStrategy,
]

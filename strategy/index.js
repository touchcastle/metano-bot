const airport = require('./airports.strategy')

module.exports = [
  airport.metarStrategy,
  airport.tafStrategy,
  airport.notamStrategy,
  airport.howtoStrategy,
  airport.infoStrategy,
  airport.chartStrategy,
  airport.aloftStrategy,
  airport.errorStrategy,
]

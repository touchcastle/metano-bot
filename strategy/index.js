const airport = require('./airports.strategy')

module.exports = [
  airport.metarStrategy,
  airport.tafStrategy,
  airport.notamStrategy,
  airport.howtoStrategy,
]

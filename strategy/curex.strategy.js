const config = require('../config')
const xCUREX_API = `http://api.fixer.io/latest?base=$fromCur$&symbols=$toCur$`

var CUREX_API = `http://api.fixer.io/latest?base=$fromCur$&symbols=$toCur$`
var api = ''
var amount = ''
var from = ''
var to = ''
var total = ''

exports.curexStrategy = {
  test: /^[0-9]+[a-zA-Z]{6}|[a-zA-Z]{6}/,
  action: 'airports/curex',
  mapToPayload: (event) => {
    event.text = event.text.toUpperCase()
    var length = event.text.length
    console.log('___________----___ '+event.text)
    if(length>6){
      amt_length = length - 6
      amount = event.text.substr(0, amt_length)
      from = event.text.substr(amt_length, 3)
      var start_to = amt_length + 3
      to = event.text.substr(start_to, 3)
    }else if(length==6){
      amount = 1
      from = event.text.substr(0, 3)
      to = event.text.substr(3, 3)
    }
    console.log('จ.>>>>>>>> '+from)
    console.log('จ.>>>>>>>> '+to)
    console.log('จ.>>>>>>>> '+amount)
    api = CUREX_API.replace('$fromCur$', from)
    api = api.replace('$toCur$', to)
    console.log('1.>>>>>>>> '+api)
    return api
  },
  resolve: async (action) => {
    console.log('2.>>>>>>>> '+api)
    const response = await global.fetch(api)
    const result = await response.json()
    //console.log('3.>>>>>>>> '+result.rates.USD)
    return result
  },
  messageReducer: async (error, result) => {
    console.log('to.>>>>>>>> '+to)
    console.log('3.>>>>>>>>'+result.rates[to])
    total = result.rates[to] * amount
    total = Number(parseFloat(total).toFixed(2)).toLocaleString()
    result = {}
    return {
      type: 'text',
      text: (amount+' '+from+' = '+total+' '+to)
    }
  }
}
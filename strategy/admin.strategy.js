const config = require('../config')
const getDBConnection = require('../connection')
const airportNotifier = require('../notifier/airport')
var airport = ''
var unfollow_txt = ''
var outArr = []
var out = ''

exports.tableStrategy = {
  test: /admin table/,
  action: 'airports/table',
  /*mapToPayload: (event) => {
    const words = event.text.split(' ')
    airport = words[1].toUpperCase()
    return {
      airportName: words[1].toUpperCase()
    }
  },*/
  resolve: async (action) => {

      //Query
      const db = await getDBConnection()

      const tables = await db.collection('airport-notification').find({}).toArray()
      console.log(action)
      out = 'ID: ' + action.source.userId + '\n\n'
      for(let table of tables){
        console.log('item> ' + table.USER_ID)
        //outArr = push(table.USER_ID + ' ' + table.airport + ' '+ table.metar_update + ' '+ table.taf_update)
        out += table.USER_ID + ' | ' + table.lineToken.substring(0,10) + ' | ' + table.airport + ' | '+ table.metar_update + ' | ' + table.taf_update + '\n'
        //console.log(out)
      }
    result = out

    console.log(result)
    return result
  },
  messageReducer: async (error, result) => {
    //console.log(tables)
    
    //return outArr.map(text => ({ type:'text', text}))
    return {
      type: 'text',
      text: result
    }
  }
}


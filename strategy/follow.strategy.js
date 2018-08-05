const config = require('../config')
const getDBConnection = require('../connection')

  exports.followStrategy = {
  test: /^follow [a-zA-Z]{4}$|^Follow [a-zA-Z]{4}$/,
  action: 'airports/follow',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    return {
      airportName: words[1]
    }
  },
  resolve: async (action) => {
    //console.log(action)
    //const response = await global.fetch(METAR_API(action.payload.airportName))
    //const result = await response.text()

    const db = await getDBConnection()
    await db.collection('airport-notification').insert({
      USER_ID: action.source.userId,
      airport: action.payload.airportName,
      //metar_update: '',
      //taf_update: ''
    })

    /*
      //REMOVE
      const db = await getDBConnection()
      await db.collection('airport-notification').remove({
        USER_ID: 'esesdsdfsf',
        airport: vtbd,
        //metar_update: '',
        //taf_update: ''
      })


    //EDIT
    const db = await getDBConnection()
    await db.collection('airport-notification').update({
      USER_ID: 'xxxxx',
      airport: 'vtbd',
      //metar_update: '',
      //taf_update: ''
    },{
      $set: {
        metar_update: '12345',
        taf_update: '23242'
      }
    })
    */
    return result
    
  },
  messageReducer: async (error, result) => {
    /*
    if (result.indexOf('0 results') <= 0) {
      var pattern = /[A-Z]{4}.+?(?=,)/
      while ((match = pattern.exec(result)) !== null) {
        var splitedTaf = match[0].split(/(?=BECMG)|(?=TEMPO)|(?=FM)/g)
        var out = ""
        for (var i = 0; i < splitedTaf.length; i++) {
          out += splitedTaf[i] + '\n'
        }
        return {
          type: 'text',
          text: (out)
        }
      }
    } else {
      return {
        type: 'text',
        text: 'เมตาโนะหาข้อมูล METAR ไม่พบค่ะ'
      }
    }
    */
    return {
      type: 'text',
      text: 'start follow'
    }
  }
}


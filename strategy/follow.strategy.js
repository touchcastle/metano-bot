const config = require('../config')
const getDBConnection = require('../connection')
const airportNotifier = require('../notifier/airport')
var airport = ''
var unfollow_txt = ''
  exports.followStrategy = {
  test: /^follow [a-zA-Z]{4}$|^Follow [a-zA-Z]{4}$/,
  action: 'airports/follow',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    airport = words[1].toUpperCase()
    return {
      airportName: words[1].toUpperCase()
    }
  },
  resolve: async (action, botInfo) => {

    const db = await getDBConnection()

    //const airportNotifications = db.collection('airport-notification')
    const checkFollowing = await db.collection('airport-notification').aggregate([
      {
        $match: {
            USER_ID: action.source.userId,
            airport: action.payload.airportName
        }
      }]).toArray()
      if(checkFollowing.length == 0){
        console.log(botInfo)
        await db.collection('airport-notification').insert({
          USER_ID: action.source.userId,
          airport: action.payload.airportName,
          lineToken: botInfo.accessToken,
          metar_update: '',
          taf_update: ''
        })
        result = 'Start following significant weather for station ' + airport
        airportNotifier()
      }else{
        result = 'Station ' + airport + ' has already been followed'
      }

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

    return {
      type: 'text',
      text: result
    }
  }
}

exports.unfollowStrategy = {
  test: /^unfollow [a-zA-Z]{4}$|^Unfollow [a-zA-Z]{4}$|^Unfollow all$|^unfollow all$/,
  action: 'airports/unfollow',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    airport = words[1].toUpperCase()
    return {
      airportName: words[1].toUpperCase()
    }
  },
  resolve: async (action, botInfo) => {

      //REMOVE
      const db = await getDBConnection()
      if (action.payload.airportName == 'ALL'){
        await db.collection('airport-notification').remove({
          USER_ID: action.source.userId
        })
        unfollow_txt = 'Weather alert for all station has been cancelled'
      }else{
        await db.collection('airport-notification').remove({
          USER_ID: action.source.userId,
          airport: action.payload.airportName,
          lineToken: botInfo.accessToken
        })
        unfollow_txt = 'Weather alert for station ' + airport + ' has been cancelled'
      }

    return result
    
  },
  messageReducer: async (error, result) => {
    return {
      type: 'text',
      text: unfollow_txt
    }
  }
}


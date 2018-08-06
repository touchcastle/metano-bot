const getConnection = require('../connection')
const fetch = require('../strategy/airports.strategy')
const config = require('../config')
const API_ENDPOINT = 'https://api.line.me/v2/bot/message/push'
require('isomorphic-fetch')
var pattern = /TSRA|\+RA|G[0-9]{2}KT/
    async function doNotifier() {
    const db = await getConnection()
    const airportNotifications = db.collection('airport-notification')
    const notifications = await airportNotifications.aggregate([
        {
            $group: {
                _id: "$airport",
                userIds: { $push: "$USER_ID"}
        }
        }]).toArray()
    console.log(notifications)

    for(let notification of notifications){
        //fetch METAR
        const result_metar = await fetch.metarStrategy.resolve({
            payload: {
                airportName: notification._id
            }
        })
        //fetch TAF
        const result_taf = await fetch.tafStrategy.resolve({
            payload: {
                airportName: notification._id
            }
        })

        //output METAR & TAF
        const output_metar = await fetch.metarStrategy.messageReducer(null, result_metar)
        const output_taf = await fetch.metarStrategy.messageReducer(null, result_taf)
        //console.log(output)
        for(let userId of notification.userIds){
            let messages = []
            if (output_metar.text.match(pattern) ) {
                messages.push(output_metar)
            }
            if (output_taf.text.match(pattern) ) {
                messages.push(output_taf)
            }
            
            if (messages.length == 0){
                continue
            }else{
                messages = [{type:'text',text:'weather aleart: '},...messages]
            }
            console.log(message)
            const fetchOptions = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${config.line.token}`
            },
            method: 'post',
            body: JSON.stringify({
                to: userId,
                messages
            })
          }
            const result = await global.fetch(API_ENDPOINT, fetchOptions)
        }
    }
}



// module.exports = doNotifier


doNotifier()
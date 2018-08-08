const getConnection = require('../connection')
const fetch = require('../strategy/airports.strategy')
const config = require('../config')
const API_ENDPOINT = 'https://api.line.me/v2/bot/message/push'
require('isomorphic-fetch')
var pattern = /TS|\+RA|G[0-9]{2}KT|WS|SEV|GR|ICE|FZ|DS|SS|FC|SN|VA|FG/
let messages = []
    async function doNotifier() {
    const db = await getConnection()
    const airportNotifications = db.collection('airport-notification')
    const notifications = await airportNotifications.aggregate([
        {
            $group: {
                _id: "$airport",
                items: { $push: { usrId: "$USER_ID", metarUpd: "$metar_update", tafUpd: "$taf_update", lineToken: "$lineToken"}},
        }
        }]).toArray()
    //console.log(notifications)
    var notiLen = notifications.length
    messages.push({type:'text',text: notiLen})
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
        const output_taf = await fetch.tafStrategy.messageReducer(null, result_taf)
        //console.log(output)
        var itemLen = notifications.items.length
        messages.push({type:'text',text: itemLen})
        for(let item of notification.items){
            //check for significant weather in metar
            //console.log('text>>>> '+output_metar.text)
            if (output_metar.text.match(pattern) ) {

                //do not notify same metar
                //if(output_metar.text.substring(5,11) != item.metarUpd){
                    messages.push(output_metar)

                    const db = await getConnection()
                    await db.collection('airport-notification').update({
                    USER_ID: item.usrId,
                    airport: notification._id,
                    lineToken: item.lineToken
                    },{
                    $set: {
                        metar_update: output_metar.text.substring(5,11)
                    }
                    })
                //}

            }
            //check for significant weather in taf
            if (output_taf.text.match(pattern) ) {

                //do not notify same taf
                //if(output_taf.text.substring(9,15) != item.tafUpd){
                    messages.push(output_taf)

                    //console.log(output_taf)
                    //console.log(notification)
                    const db = await getConnection()
                    await db.collection('airport-notification').update({
                      USER_ID: item.usrId,
                      airport: notification._id,
                      lineToken: item.lineToken
                    },{
                      $set: {
                        //metar_update: 'UPD_MET'
                        taf_update: output_taf.text.substring(9,15)
                      }
                    })
                //}

            }
            //if no significant weather, skip to next airport
            if (messages.length == 0){
                continue
            }else{
                messages = [{type:'text',text:'Weather alert for station: ' + notification._id},...messages]
            }
            console.log('token>'+item.lineToken)
            const fetchOptions = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${item.lineToken}`
            },
            method: 'post',
            body: JSON.stringify({
                to: item.usrId,
                messages
            })
          }
            const result = await global.fetch(API_ENDPOINT, fetchOptions)
        }
    }
}

module.exports = doNotifier
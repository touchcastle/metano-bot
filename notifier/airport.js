const getConnection = require('../connection')
const fetch = require('../strategy/airports.strategy')
const config = require('../config')
const API_ENDPOINT = 'https://api.line.me/v2/bot/message/push'
require('isomorphic-fetch')
//var pattern = /TS|\+RA|G[0-9]{2}KT|WS|SEV|GR|ICE|FZ|DS|SS|FC|SN|VA|FG/
var pattern = /TS|RA|WS|SEV|GR|ICE|FZ|DS|SS|FC|SN|VA|FG|9999/
let messages = []
var chkMetar = ''
var chkTaf = ''
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
    //var notiLen = notifications.length
    //messages.push({type:'text',text: 'header = ' + notiLen})
    for(let notification of notifications){
        console.log('curser > ' + notification._id)
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
        console.log('output_taf >> ' + output_taf)
        var output_metar = ''
        var output_taf = ''
        output_metar = await fetch.metarStrategy.messageReducer(null, result_metar)
        output_taf = await fetch.tafStrategy.messageReducer(null, result_taf)

        console.log(output_taf)
        //console.log(output)
        //var itemLen = notification.items.length
        //messages.push({type:'text',text: 'item = ' + itemLen})
        for(let item of notification.items){
            chkMetar = ''
            chkTaf = ''
            var metarTime = ''
            //check for significant weather in metar
            //console.log('text>>>> '+output_metar.text)
            if (output_metar.text.substring(5,text.length).match(pattern) ) {
                metarTime = output_metar.text.substring(5,11)
                //do not notify same metar
                if(metarTime != item.metarUpd){
                    //output_metar.text = 'METAR: '.concat(output_metar.text)
                    messages.push(output_metar)
                    chkMetar = 'X'
                    const db = await getConnection()
                    await db.collection('airport-notification').update({
                    USER_ID: item.usrId,
                    airport: notification._id,
                    lineToken: item.lineToken
                    },{
                    $set: {
                        metar_update: metarTime
                    }
                    })
                }
            }
            //check for significant weather in taf
            if (output_taf.text.substring(8,text.length).match(pattern) ) {

                //do not notify same taf
                var tafTime = ''
                if(output_taf.text.match(/COR/)){
                    tafTime = output_taf.text.substring(13,19)
                }else{
                    tafTime = output_taf.text.substring(9,15)
                }
                console.log('time> ' + tafTime)
                if(tafTime != item.tafUpd){
                    //output_taf.text = 'Forcast report. Publish at '.concat(tafTime).concat(' UTC\n\n').concat(output_taf.text)
                    messages.push(output_taf)
                    chkTaf = 'X'
                    console.log(output_taf)

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
                        taf_update: tafTime
                      }
                    })
                }
                //output_taf.text = ''
            }
            //if no significant weather, skip to next airport
            if (messages.length == 0){
                continue
            }else{
                messages = [{type:'text',text:'Weather alert for station: ' + notification._id},...messages]
            }
            console.log(messages)
            //console.log('token>'+item.lineToken)
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
            messages = []
        }

        console.log('=====================')
    }
}

module.exports = doNotifier
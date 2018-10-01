const config = require('../config')
var latlon = []
var lat = 0.0
var lon = 0.0 
var lon_D = 0.0
var lon_M = 0.0
var lon_S = 0.0
var err = ''

exports.locationStrategy = {
  test: /^loc/,
  action: 'airports/location',
  mapToPayload: (event) => {
    event.text = event.text.substring(3)
    if(event.text.match(/N|S|E|W/)){
      if(event.text.match(/N/)){
        event.text = event.text.replace('N','N|')
        //console.log('1 '+event.text)
      }else if(event.text.match(/S/)){
        event.text.replace('S','S|')
      }
      const words = event.text.split('|')
      return {
        location: words
      }
    }else{
      err = 'X'
    }
  },
  resolve: async (action, botInfo) => {

    if(err != 'X'){
      console.log('LAT '+action.payload.location[0])

      //LAT
      const latString = action.payload.location[0].trim()
      console.log('string ' + latString)
      const lat_D = parseInt(latString.substring(0,2))
      const lat_M = parseInt(latString.substring(2,4))
      const lat_S = parseInt(latString.substring(4,6))
      lat = lat_D + (((lat_M*60)+lat_S)/3600)
      if(latString.match(/S/)){
        lat = lat * -1
      }
      console.log(lat)


      //LON
      const lonString = action.payload.location[1].trim()
      console.log('string ' + lonString)
      console.log(lonString.length)
      if(lonString.length == 7){
        lon_D = parseInt(lonString.substring(0,2))
        lon_M = parseInt(lonString.substring(2,4))
        lon_S = parseInt(lonString.substring(4,6))
      }else if(lonString.length == 8){
        console.log('++++++++++')
        lon_D = parseInt(lonString.substring(0,3))
        console.log(lon_D)
        lon_M = parseInt(lonString.substring(3,5))
        console.log(lon_M)
        lon_S = parseInt(lonString.substring(5,7))
        console.log(lon_S)
      }

      lon = lon_D + (((lon_M*60)+lon_S)/3600)
      if(lonString.match(/W/)){
        lon = lon * -1
      }
      console.log(lon)

      /*action.payload.location.replace(' ', '')

      console.log(action.payload.location)

      if(action.payload.location.match(/N/)){
        latlon = action.payload.location.split('N')
        latlon[0] = latlon[0].concat('N')
      }else if(action.payload.location.match(/S/)){
        latlon = action.payload.location.split('S')
        latlon[0] = latlon[0].concat('S')
      }*/

      
      //console.log(latlon)
    }
    result = 'X'
    return result
    
  },
  messageReducer: async (error, result) => {
    if(err != 'X'){
      return {
        type: 'location',
        title: 'LOCATION',
        address: 'tap to explore',
        latitude: lat,
        longitude: lon
      }
    }else{
      return{
        type: 'text',
        text: 'Please provide location in DMS format (e.g. 162752N1024656E)'
      }
    }
  }
}

/*
exports.errorStrategy = {
  test: /^.+/,
  action: 'airports/error',
  resolve: async (action) => {
    result = 'Oops!, I don\'t understand this question yet\n'+
             'Please type "howto" for instruction'
    return result
  },
  messageReducer: async (error, result) => {
    return {
      type: 'location',
      title: 'title',
      address: 'address',
      latitude: 16.4644444,
      longitude: 102.78222222222222
      /*
      type: 'text',
      text: (result)
      
    }
  }
}
*/
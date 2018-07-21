const config = require('../config')
const METAR_API = (station) => `http://weather.tmd.go.th/${station}/${station}240_latest.$fileType$`

var noStation = ''

exports.radarStrategy = {
  //test: /^chart [0-9]{4}-[0-9]{2}-[0-9]{2}|^Chart [0-9]{4}-[0-9]{2}-[0-9]{2}/,
  test: /(radar)|(Radar)|(RADAR)/,
  action: 'airports/radar',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    noStation = ''
    if(words[1]==null){
      noStation = 'X'
    }
    return {
      station: words[1]
    }
  },
  resolve: async (action) => {
    if(noStation!='X'){
      var result = METAR_API(action.payload.station)
      if(action.payload.station=='cmp'){
        var fileType = 'jpg'
      }else if(action.payload.station=='sat'||action.payload.station=='pmi'){
        var fileType = 'png'
      }else{
        var fileType = 'gif'
      }
      var result = result.replace('$fileType$', fileType)
    }else if(noStation=='X'){
      result = 'ดูภาพ Weather Radar พิมพ์คำว่า radar เว้นวรรคแล้วตามด้วยชื่อสถานีค่ะ\n\n' +
      'รายชื่อสถานี:\n[sat-สัตหีบ]\n[svp-สุวรรณภูมิ]\n[lmp-ลำพูน]\n[kkn-ขอนแก่น]\n[ubn-อุบลฯ]\n[cmp-ชุมพร]\n[hhn-หัวหิน]\n\n' +
      'ตัวอย่าง: Weather Radar สัตหีบ "radar sat"\n\n'
    }
    return result
  },
  messageReducer: async (error, result) => {
    return {
      type: 'text',
      text: (result)
    }
  }
}
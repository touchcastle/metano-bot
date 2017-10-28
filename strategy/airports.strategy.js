const config = require('../config')
const METAR_API = (airportName) =>
`https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/airports/weather/current-conditions-list?airports=${airportName}&api_key=${config.ICAO_API_KEY}&format=json`
const TAF_API = (airportName) =>
`https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=csv&startTime=1508947074&endTime=1508954274&stationString=${airportName}&mostRecentForEachStation=true`
const NOTAM_API = (airportName) =>
`https://api.autorouter.aero/v1.0/notam?itemas=[%22${airportName}%22]&offset=0&limit=10`

exports.howtoStrategy = {
  test: /^howto|^Howto/,
  action: 'airports/howto',
  resolve: async (action) => {
    result = 'สวัสดีค่ะ สามารถใช้งาน"เมตาโนะ"ได้ง่ายๆดังนี้ค่ะ\n\n'+
              '1.)ดูข้อมูล METAR\nพิมพ์คำว่า metar เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ'+
              '\n(ตัวอย่าง ข้อมูล METAR ของสนามบินดอนเมือง "metar vtbd"\n\n'+
              '2.)ดูข้อมูล TAF\nพิมพ์คำว่า taf เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ'+
              '\n(ตัวอย่าง ข้อมูล TAF ของสนามบินดอนเมือง "taf vtbd"\n\n'+
              '3.)ดูข้อมูล NOTAM\nพิมพ์คำว่า notam เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ'+
              '\n(ตัวอย่าง ข้อมูล NOTAM ของสนามบินดอนเมือง "notam vtbd"\n\n'+
              '=========='
    return result
  },
  messageReducer: async (error, result) => {
    return {
      type: 'text',
      text: (result)
    }
  }
}

exports.metarStrategy = {
  test: /^metar [a-zA-Z]{4}$|^Metar [a-zA-Z]{4}$/,
  action: 'airports/metar',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    return {
      airportName: words[1]
    }
  },
  resolve: async (action) => {
    const response = await global.fetch(METAR_API(action.payload.airportName))
    const result = await response.json()
    return result
  },
  messageReducer: async (error, result) => {
    console.log(result[0])
    if(result[0]==null){
      return {
        type: 'text',
        text: 'ไม่มีข้อมูลค่ะ'
      }
    }else{
      var len = result[0].raw_metar.length
      var count = len - 9
      return {
        type: 'text',
        text: (result[0].raw_metar).substr(0, count)+' ค่ะ'
      }
    }
  }
}

exports.tafStrategy = {
  test: /^taf [a-zA-Z]{4}$|^Taf [a-zA-Z]{4}$/,
  action: 'airports/taf',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    return {
      airportName: words[1]
    }
  },
  resolve: async (action) => {
    const response = await global.fetch(TAF_API(action.payload.airportName))
    const result = await response.text()
    console.log(result)
    return result
  },
  messageReducer: async (error, result) => {
    if(result.indexOf('0 results') <= 0){
      var pattern = /[A-Z]{3}.+?(?=,)/
      while ((match = pattern.exec(result)) !== null) {
        var splitedTaf = match[0].split(/(?=BECMG)|(?=TEMPO)|(?=FM)/g)
        var out = ""
        for(var i=0;i<splitedTaf.length;i++){
          out += splitedTaf[i]+'\n'
        }
        return {
          type: 'text',
          text: (out)
        }
      }
    }else{
      return {
        type: 'text',
        text: 'ไม่มีข้อมูลค่ะ'
      }
    }
  }
}

exports.notamStrategy = {
  test: /^notam [a-zA-Z]{4}$|^Notam [a-zA-Z]{4}$/,
  action: 'airports/notam',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    return {
      airportName: words[1].toUpperCase()
    }
  },
  resolve: async (action) => {
    const response = await global.fetch(NOTAM_API(action.payload.airportName))
    const result = await response.json()
    console.log(result)
    return result
  },
  messageReducer: async (error, result) => {
    var rows = result.rows.length
    var out = ""
    for(var i=0;i<rows;i++){
      //A)
      out += 'A) '+(result.rows[i].itema[0])+'\n'
      //B)
      var a = new Date(result.rows[i].startvalidity * 1000);
      var months = ['01','02','03','04','05','06','07','09','09','10','11','12'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = ((a.getDate())>=10)? (a.getDate()) : '0' + (a.getDate());
      var hour = ((a.getHours())>=10)? (a.getHours()) : '0' + (a.getHours());
      var min = ((a.getMinutes())>=10)? (a.getMinutes()) : '0' + (a.getMinutes());
      var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min;
      out += 'B) '+time+' '

      //C)
      var a = new Date(result.rows[i].endvalidity * 1000);
      var months = ['01','02','03','04','05','06','07','09','09','10','11','12'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = ((a.getDate())>=10)? (a.getDate()) : '0' + (a.getDate());
      var hour = ((a.getHours())>=10)? (a.getHours()) : '0' + (a.getHours());
      var min = ((a.getMinutes())>=10)? (a.getMinutes()) : '0' + (a.getMinutes());
      var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min;
      out += 'C) '+time+'\n'

      //E)
      var eLength = (result.rows[i].iteme).length
      var maxLength = 200
      if(eLength <= maxLength){
        out += 'E) '+(result.rows[i].iteme)+'\n'
      }else{
        out += 'E) '+(result.rows[i].iteme).substr(0,maxLength-3)+'...'+'\n'
      }
      //F)
      if ((result.rows[i].itemf)!==null){
        out += 'F) '+(result.rows[i].itemf)+'\n'
      }
      //G)
      if ((result.rows[i].itemg)!==null){
        out += 'G) '+(result.rows[i].itemg)+'\n'
      }

      out += '\n'+'=========='+'\n\n'
    }
    return {
      type: 'text',
      text: (out)
    }
  }
}

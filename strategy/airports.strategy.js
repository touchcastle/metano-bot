const config = require('../config')
const METAR_API = (airportName) =>
  `https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/airports/weather/current-conditions-list?airports=${airportName}&api_key=${config.ICAO_API_KEY}&format=json`
const TAF_API = (airportName) =>
  `https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=csv&startTime=1508947074&endTime=1508954274&stationString=${airportName}&mostRecentForEachStation=true`
const NOTAM_API = (airportName) =>
  `https://api.autorouter.aero/v1.0/notam?itemas=[%22${airportName}%22]&offset=0&limit=10`
const INFO_API = (airportName) =>
  `https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/airports/locations/doc7910?api_key=${config.ICAO_API_KEY}&airports=${airportName}&format=json`

exports.howtoStrategy = {
  test: /^howto|^Howto/,
  action: 'airports/howto',
  resolve: async (action) => {
    result = 'สวัสดีค่ะ สามารถใช้งาน"เมตาโนะ"ได้ง่ายๆดังนี้ค่ะ\n\n' +
      '1.)ดูข้อมูล METAR\nพิมพ์คำว่า metar เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ' +
      '\n(ตัวอย่าง ข้อมูล METAR ของสนามบินดอนเมือง "metar vtbd"\n\n' +
      '2.)ดูข้อมูล TAF\nพิมพ์คำว่า taf เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ' +
      '\n(ตัวอย่าง ข้อมูล TAF ของสนามบินดอนเมือง "taf vtbd"\n\n' +
      '3.)ดูข้อมูล NOTAM\nพิมพ์คำว่า notam เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ' +
      '\n(ตัวอย่าง ข้อมูล NOTAM ของสนามบินดอนเมือง "notam vtbd"\n\n' +
      '4.)ดูข้อมูลของสนามบิน\nพิมพ์คำว่า info เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ' +
      '\n(ตัวอย่าง ข้อมูลของสนามบินดอนเมือง "info vtbd"\n\n' +
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
    if (result[0] == null) {
      return {
        type: 'text',
        text: 'เมตาโนะหาข้อมูล METAR ไม่พบค่ะ'
      }
    } else {
      var len = result[0].raw_metar.length
      var count = len - 9
      return {
        type: 'text',
        text: (result[0].raw_metar).substr(0, count) + ' ค่ะ'
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
    if (result.indexOf('0 results') <= 0) {
      var pattern = /[A-Z]{3}.+?(?=,)/
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
        text: 'เมตาโนะหาข้อมูล TAF ไม่พบค่ะ'
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
    //console.log(result)
    return result
  },
  messageReducer: async (error, result) => {
    console.log(result.total)
    if (result.total !== 0) {
      var rows = result.rows.length
      var out = ""
      var outArr = []
      for (var i = 0; i < rows; i++) {
        out = ''
        if(i==0){
          out += "เมตาโนะพบข้อมูล NOTAM ทั้งหมด "+rows+" รายการ ดังนี้ค่ะ\n"
          console.log(rows)
          if(rows>=6){
            out += "**ข้อมูลบางส่วนถูกตัดออกเนื่องจากมีความยาวเกินกำหนด กรุณาตรวจสอบจากแหล่งอื่นเพิ่มเติมด้วยนะคะ\n\n"
          }else{
            out += '\n'
          }
        }
        out += (i + 1) + '].\n'
        if (result.rows[i].lower == '0') {
          result.rows[i].lower = '000'
        }
        out += result.rows[i].series + result.rows[i].number + '/' + result.rows[i].year + ' ' + 'NOTAM' + result.rows[i].type
        if (result.rows[i].type == 'R' | result.rows[i].type == 'C') {
          out += ' ' + result.rows[i].referredseries + result.rows[i].referrednumber + '/' + result.rows[i].referredyear
        }
        out += '\n'
        out += 'Q) ' + result.rows[i].fir + '/' + result.rows[i].code23 + result.rows[i].code45 + '/' + result.rows[i].traffic +
          '/' + result.rows[i].purpose + '/' + result.rows[i].scope + '/' + result.rows[i].lower + '/' + result.rows[i].upper + '\n'
        //A)
        out += 'A) ' + (result.rows[i].itema[0]) + '\n'

        var months = ['01', '02', '03', '04', '05', '06', '07', '09', '09', '10', '11', '12'];
        //B)
        var a = new Date(result.rows[i].startvalidity * 1000);
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = ((a.getDate()) >= 10) ? (a.getDate()) : '0' + (a.getDate());
        var hour = ((a.getHours()) >= 10) ? (a.getHours()) : '0' + (a.getHours());
        var min = ((a.getMinutes()) >= 10) ? (a.getMinutes()) : '0' + (a.getMinutes());
        var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min;
        out += 'B) ' + time + ' '

        //C)
        var a = new Date(result.rows[i].endvalidity * 1000);
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = ((a.getDate()) >= 10) ? (a.getDate()) : '0' + (a.getDate());
        var hour = ((a.getHours()) >= 10) ? (a.getHours()) : '0' + (a.getHours());
        var min = ((a.getMinutes()) >= 10) ? (a.getMinutes()) : '0' + (a.getMinutes());
        var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min;
        out += 'C) ' + time + '\n'

        //E)
        var eLength = (result.rows[i].iteme).length
        var maxLength
        if(rows<=5){
          maxLength = '999'
        }else{
          maxLength = '190'
        }
        if (eLength <= maxLength) {
          out += 'E) ' + (result.rows[i].iteme) + '\n'
        } else {
          out += 'E) ' + (result.rows[i].iteme).substr(0, maxLength - 3) + '...' + '\n'
        }
        //F)
        if ((result.rows[i].itemf) !== null) {
          out += 'F) ' + (result.rows[i].itemf) + '\n'
        }
        //G)
        if ((result.rows[i].itemg) !== null) {
          out += 'G) ' + (result.rows[i].itemg) + '\n'
        }
        //out += '\n'+'=========='+'\n\n'
        if(i==rows-1){
          out += "\n==== จบรายงาน NOTAM ค่ะ ===="
        }
        outArr.push(out)
      }
      //outArr.push("จบรายงาน NOTAM ค่ะ")
      if(outArr.length<=5){
        return outArr.map(text => ({ type:'text', text}))
      }else{
        const str = outArr.reduce((current, next) => {
          return current + '\n' + next
        }, '')
        //console.log('=====', str, '=====')
        return {
          type: 'text',
          text: str
        }
      }
    } else {
      return {
        type: 'text',
        text: 'เมตาโนะหาข้อมูล NOTAM ไม่พบค่ะ'
      }
    }
  }
}

exports.infoStrategy = {
  test: /^info [a-zA-Z]{4}$|^Info [a-zA-Z]{4}$/,
  action: 'airports/info',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    return {
      airportName: words[1]
    }
  },
  resolve: async (action) => {
    const response = await global.fetch(INFO_API(action.payload.airportName))
    const result = await response.json()
    return result
  },
  messageReducer: async (error, result) => {
    if (result[0] == null) {
      return {
        type: 'text',
        text: 'ไม่มีข้อมูลค่ะ'
      }
    } else {
      return {
        type: 'text',
        text: 'Name: ' + (result[0].Location_Name) + '\n' +
        'State: ' + (result[0].State_Name) + '\n' +
        'ICAO Code: ' + (result[0].ICAO_Code) + '\n' +
        'IATA Code: ' + (result[0].IATA_Code) + '\n' +
        'Latitude: ' + (result[0].Latitude) + '\n' +
        'Longtitude: ' + (result[0].Longitude)
      }
    }
  }
}

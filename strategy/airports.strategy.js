const config = require('../config')
const METAR_API = (airportName) =>
  `https://aviationweather.gov/adds/dataserver_current/httpparam?datasource=metars&requestType=retrieve&format=csv&mostRecentForEachStation=constraint&hoursBeforeNow=99&stationString=${airportName}`
const TAF_API = (airportName) =>
  `https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=csv&stationString=${airportName}&hoursBeforeNow=3&mostRecentForEachStation=constraint`
const NOTAM_API = (airportName) =>
  `https://api.autorouter.aero/v1.0/notam?itemas=[%22${airportName}%22]&offset=0&limit=99`
const INFO_API = (airportName) =>
  `https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/airports/locations/doc7910?api_key=${config.ICAO_API_KEY}&airports=${airportName}&format=json`

  var code = ''
  var foundCode = ''
  var box = 1
  var maxInBox = 1
  var tooMuch = ''
  var cutText = ''

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
    const result = await response.text()
    return result
  },
  messageReducer: async (error, result) => {
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
  }
}

exports.tafStrategy = {
  test: /^taf [a-zA-Z]{4}$|^Taf [a-zA-Z]{4}$|^TAF [a-zA-Z]{4}$/,
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
  test: /^notam [a-zA-Z]{4}$|^Notam [a-zA-Z]{4}$|^NOTAM [a-zA-Z]{4}$|^Notam [a-zA-Z]{4} [a-zA-z]{1}[0-9]{4}|^notam [a-zA-Z]{4} [a-zA-z]{1}[0-9]{4}|^NOTAM [a-zA-Z]{4} [a-zA-z]{1}[0-9]{4}|^notam [a-zA-Z]{4} [a-zA-z]{1}[0-9]{3}|^Notam [a-zA-Z]{4} [a-zA-z]{1}[0-9]{3}|^NOTAM [a-zA-Z]{4} [a-zA-z]{1}[0-9]{3}/,
  action: 'airports/notam',
  mapToPayload: (event) => {
    const words = event.text.split(' ')
    code = ''
    foundCode = ''
    tooMuch = ''
    box = 1
    maxInBox = 1
    cutText = ''
    if(words[2]!=null){
      code = words[2].toUpperCase()
    }
    return {
      airportName: words[1].toUpperCase()
    }
  },
  resolve: async (action) => {
    const response = await global.fetch(NOTAM_API(action.payload.airportName))
    const result = await response.json()
    return result

  },
  messageReducer: async (error, result) => {
    if (result.total !== 0) {
      var rows = result.rows.length
      var tooMuchRows = ''
      var out = ''
      var outArr = []

      var maxLengthE
      if(rows<=5){
        box = rows
        maxInBox = 1
      }else if(rows<=15){
        box = Math.ceil(rows/3)
        maxInBox = 3
      }else if(rows<=25){
        box = Math.ceil(rows/5)
        maxInBox = 5
      }else{
        box = Math.ceil(rows/5)
        maxInBox = 5
        tooMuchRows = rows
        rows = 25
        tooMuch = 'X'
      }
      maxLengthE = (2000/maxInBox)-250

      var index = 0
      for (var i = 0; i < rows; i++) {

        if(code!=''){
          var notamNO = result.rows[i].series + result.rows[i].number
          console.log(notamNO)
          console.log('code: '+code)
          if(notamNO!=code){
            continue
            console.log('1')
          }else{
            foundCode = 'X'
          }
        }
        
        index++
        if((index>maxInBox)&(i!=0)){
          outArr.push(out)
          index = 1
          out = ''
        }

        if(code==''){  //only in normal report, not in specific notam report
          if(i==0){
            if(tooMuch==''){
              out += "พบ NOTAM "+rows+" รายการ\n"
            }else if(tooMuch=='X'){
              out += '\n$TOOMUCH$'
            }
            out += '\n$CUTTEXT$'
          }
          out += (i + 1) + ')\n'
        }

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
        //D)
        if ((result.rows[i].itemd) !== null) {
          out += 'D) ' + (result.rows[i].itemd) + '\n'
        }
        //E)
        var eLength = (result.rows[i].iteme).length
        if ((eLength <= maxLengthE)|code!='') {
        //if (eLength <= maxLengthE) {
          out += 'E) ' + (result.rows[i].iteme) + '\n'
        } else { 
          cutText = 'X'
          out += 'E) ' + (result.rows[i].iteme).substr(0, maxLengthE - 3) + '...' + '\n'
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
          out += "\n==== end of NOTAMs report ===="
        }else{
          out += '\n'
        }
      }
      if(out!==''){
        outArr.push(out)
        out = ''
      }
      console.log('cut: '+cutText)
      console.log('cut: '+outArr[0])

      //Add remark for toomuch
      if(cutText=='X'){
        outArr[0] = outArr[0].replace('\n$TOOMUCH$', "* พบ NOTAM มากเกินกำหนด("+tooMuchRows+"รายการ) สามารถแสดงได้เพียง 25 รายการ\nรบกวนตรวจสอบจากแหล่งอื่นเพิ่มเติมด้วยนะคะ\n\n")
        console.log('cut: '+outArr[0])
      }

      //Add remark for cuttext
      if(cutText=='X'){
        outArr[0] = outArr[0].replace('\n$CUTTEXT$', "** ข้อมูลบางส่วนได้ถูกตัดออกเนื่องจากมีความยาวเกินกำหนด สามารถระบุ series และ number ต่อท้ายเพื่ออ่านทั้งหมดได้ค่ะ\n"+
        "(ตัวอย่าง: notam vtbd C1234)\n\n")
        console.log('cut: '+outArr[0])
      }else{
        if(outArr[0]!=null){
          outArr[0] = outArr[0].replace('$CUTTEXT$', '\n')
        }
      }
      /*var outArrTemp = []
      for (var i = 0; i < rows; i++) {

      }*/
      console.log('toomuch>'+tooMuch)
      console.log('code>'+code)
      console.log('foundCode>'+foundCode)
      /*if(tooMuch=='X'){
        return {
          type: 'text',
          text: 'ข้อมูล NOTAM มีจำนวนมากเกินกำหนด(มากกว่า 25 รายการ) กรุณาตรวจสอบจากแหล่งอื่นค่ะ'
        }
      }else*/
      if(code==''|((code!='')&&(foundCode=='X'))){
        console.log('2')
        //if(outArr.length<=5){
          return outArr.map(text => ({ type:'text', text}))
        /*}else{
          const str = outArr.reduce((current, next, index) => {
            if(index==0){
              return next
            }else{
              return current + '\n' + next
            }
          }, '')
          //console.log('=====', str, '=====')
          return {
            type: 'text',
            text: str
          }
        }*/
      }else if(code!=''&&foundCode==''){
        return {
          type: 'text',
          text: 'เมตาโนะหาข้อมูล NOTAM ไม่พบค่ะ'
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
  test: /^info [a-zA-Z]{4}$|^Info [a-zA-Z]{4}$|^INFO [a-zA-Z]{4}$/,
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
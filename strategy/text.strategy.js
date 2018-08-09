const config = require('../config')

exports.howtoStrategy = {
  test: /^howto|^Howto|^HOWTO/,
  action: 'airports/howto',
  resolve: async (action) => {
    //ENG
    result = 'SAWASDEE KA! Let\'s talk! \n\n' + 
    '1.) "metar vtbs" --- METAR report for VTBS\n\n' +
    '2.) "taf vtbs" --- TAFs for VTBS\n\n' +
    '3.) "notam vtbs" --- List all NOTAM for VTBS (limited lenght & 25 NOTAMS maximum)\n\n' +
    '4.) "notam vtbs c1234" --- Display VTBS NOTAM number c1234\n\n' +
    '5.) "loc 123628N1005632E" --- Show map of location by DHM format\n\n' +
    '6.) "follow vtbs"[TESTING] --- Get notification for significant meteorological condition of VTBS\n\n' +
    '7.) "unfollow vtbs"[TESTING] --- Cancel notification from VTBD\n\n' +
    '8.) "unfollow all"[TESTING] --- Cancel notification from every station\n\n' +
    '9.) "info vtbs" --- Display VTBS information\n\n' +
    '10.) "radar sat" --- Display weather radar for Sattahip station\n' +
    'List: [sat-Sattahip],[svp-Suvarnabhumi],[lmp-Lamphun],[kkn-Khonkaen],[ubn-Ubon]' +
    '[pmi-Pimai],[psh-Pitsanulok],[cmp-Chumphon],[hhn-Huahin]\n\n' +
    '11.) "chart" --- Display Thailand weather chart\n\n' +
    '12.) "aloft" --- Display Thailand wind aloft (5000ft)\n\n' +
    //'8.)ดูข้อมูลของสนามบิน\nพิมพ์คำว่า info เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ' +
    //'\n(ตัวอย่าง: ข้อมูลของสนามบินดอนเมือง "info vtbd")\n\n' +
    //'8.)อัตราแลกเปลี่ยนเงินตราต่างประเทศ พิมพ์จำนวนเงิน ตามด้วย2สกุลเงินที่ต้องการเลยค่ะ'+
    //'\n(ตัวอย่าง: 10 ดอลลาร์สหรัฐฯ เป็น บาทไทย พิมพ์ "10usdthb" ได้เลยค่ะ)\n\n' +
    '=========='
    /*
    //THAI
    result = 'สวัสดีค่ะ สามารถใช้งาน"เมตาโนะ"ได้ง่ายๆดังนี้ค่ะ\n\n' +
      '1.)ดูข้อมูล METAR\nพิมพ์คำว่า metar เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ' +
      '\n(ตัวอย่าง: ข้อมูล METAR ของสนามบินดอนเมือง "metar vtbd")\n\n' +
      '2.)ดูข้อมูล TAF\nพิมพ์คำว่า taf เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ' +
      '\n(ตัวอย่าง: ข้อมูล TAF ของสนามบินดอนเมือง "taf vtbd")\n\n' +
      '3.)ดูข้อมูล NOTAM\nพิมพ์คำว่า notam เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ' +
      '\n(ตัวอย่าง: ข้อมูล NOTAM ของสนามบินดอนเมือง "notam vtbd")' +
      '\nและหาก NOTAM บางรายการถูกตัดออกเนื่องจากความยาวเกิดกำหนด โนตาเมะจะเติม...ต่อท้ายให้ทราบค่ะ' +
      '\nซึ่งสามารถเรียกดูแบบละเอียดทีละรายการได้โดยกรอก NOTAM series และ number ต่อท้าย' +
      '\n(ตัวอย่าง: NOTAM สนามบินดอนเมือง หมายเลข C1234'+'\n"notam vtbd C2525")\n\n'+
      '4.)ติดตามสภาพอากาศสำคัญ พิมพ์ follow ตามด้วย ICAO code ของสนามบินนั้นๆค่ะ' +
      '\n(ตัวอย่าง: ติดตามสภาพอากาศของสนามบินดอนเมือง "follow vtbd")\n\n' +
      '5.)ดูภาพ Weather Radar พิมพ์คำว่า radar เว้นวรรคแล้วตามด้วยชื่อสถานีค่ะ\n' +
      'รายชื่อสถานี: [sat-สัตหีบ],[svp-สุวรรณภูมิ],[lmp-ลำพูน],[kkn-ขอนแก่น],[ubn-อุบลฯ],[cmp-ชุมพร],[hhn-หัวหิน]\n' +
      '(ตัวอย่าง: Weather Radar สุวรรณภูมิ "radar svp")\n\n' +
      '6.)ดูภาพ Thailand Weather Chart\nพิมพ์คำว่า "chart" ได้เลยค่ะ\n\n' +
      '7.)ดูภาพ Thailand Wind Aloft(5000ft)\nพิมพ์คำว่า "aloft" ได้เลยค่ะ\n\n'+
      '8.)ดูข้อมูลของสนามบิน\nพิมพ์คำว่า info เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ' +
      '\n(ตัวอย่าง: ข้อมูลของสนามบินดอนเมือง "info vtbd")\n\n' +
      //'8.)อัตราแลกเปลี่ยนเงินตราต่างประเทศ พิมพ์จำนวนเงิน ตามด้วย2สกุลเงินที่ต้องการเลยค่ะ'+
      //'\n(ตัวอย่าง: 10 ดอลลาร์สหรัฐฯ เป็น บาทไทย พิมพ์ "10usdthb" ได้เลยค่ะ)\n\n' +
      '=========='
      */
    return result
  },
  messageReducer: async (error, result) => {
    return {
      type: 'text',
      text: (result)
    }
  }
}

//lastest ID
exports.idStrategy = {
  test: /^id|^ID|^Id/,
  action: 'airports/id',
  resolve: async (action) => {
    result = '@nqu0290r'
    return result
  },
  messageReducer: async (error, result) => {
    return {
      type: 'text',
      text: (result)
    }
  }
}

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
      type: 'text',
      text: (result)
    }
  }
}
const config = require('../config')

exports.howtoStrategy = {
  test: /^howto|^Howto|^HOWTO/,
  action: 'airports/howto',
  resolve: async (action) => {
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
      '4.)ดูภาพ Weather Radar พิมพ์คำว่า radar เว้นวรรคแล้วตามด้วยชื่อสถานีค่ะ\n' +
      'รายชื่อสถานี: [sat-สัตหีบ],[svp-สุวรรณภูมิ],[lmp-ลำพูน],[kkn-ขอนแก่น],[ubn-อุบลฯ],[cmp-ชุมพร],[hhn-หัวหิน]\n' +
      '(ตัวอย่าง: Weather Radar สุวรรณภูมิ "radar svp")\n\n' +
      '5.)ดูภาพ Thailand Weather Chart\nพิมพ์คำว่า "chart" ได้เลยค่ะ\n\n' +
      '6.)ดูภาพ Thailand Wind Aloft(5000ft)\nพิมพ์คำว่า "aloft" ได้เลยค่ะ\n\n'+
      '7.)ดูข้อมูลของสนามบิน\nพิมพ์คำว่า info เว้นวรรคแล้วตามด้วย ICAO code ของสนามบินนั้นๆค่ะ' +
      '\n(ตัวอย่าง: ข้อมูลของสนามบินดอนเมือง "info vtbd")\n\n' +
      //'8.)อัตราแลกเปลี่ยนเงินตราต่างประเทศ พิมพ์จำนวนเงิน ตามด้วย2สกุลเงินที่ต้องการเลยค่ะ'+
      //'\n(ตัวอย่าง: 10 ดอลลาร์สหรัฐฯ เป็น บาทไทย พิมพ์ "10usdthb" ได้เลยค่ะ)\n\n' +
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

//lastest ID
exports.howtoStrategy = {
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
    result = 'ฉันไม่เข้าใจคำถามนี้ค่ะ\n'+
             'สามารถตรวจสอบวิธีใช้งานได้จาก "howto" ค่ะ'
    return result
  },
  messageReducer: async (error, result) => {
    return {
      type: 'text',
      text: (result)
    }
  }
}
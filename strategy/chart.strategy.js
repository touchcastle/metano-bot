const config = require('../config')
const CHART_API = (chartDate) =>
  `https://www.tmd.go.th/programs/uploads/maps/${chartDate}_TopChart_$time$.jpg`

exports.chartStrategy = {
  //test: /^chart [0-9]{4}-[0-9]{2}-[0-9]{2}|^Chart [0-9]{4}-[0-9]{2}-[0-9]{2}/,
  test: /(chart)|(Chart)/,
  action: 'airports/chart',
  /*mapToPayload: (event) => {
    const words = event.text.split(' ')
    return {
      chartDate: words[1]
    }
  },*/
  resolve: async (action) => {

    var chartDate = new Date();
    var dd = chartDate.getDate()
    var mm = chartDate.getMonth()+1 //January is 0!
    var yyyy = chartDate.getFullYear()
    var hh = chartDate.getUTCHours()+7  //GMT+7
    var min = chartDate.getMinutes()

    console.log(hh)

    var time
    if((hh<4)){
      dd = dd-1
      console.log(dd)
      if(dd==0){
        mm = mm-1
        if(mm==0){
          yyyy = yyyy-1
          mm = 12
        }
        if((mm==1)||(mm==3)||(mm==5)||(mm==7)||(mm==8)||(mm==10)||(mm==12)){
          dd = 31
        }else if((mm==4)||(mm==6)||(mm==8)||(mm==11)){
          dd = 30
        }else{
          if(yyyy%4==0){
            dd = 28
          }else{
            dd = 29
          }
        }
      }
      time = 19
    }else{
      if(hh>22){
        time = '19'
      }else if(hh>16){
        time = '13'
      }else if(hh>10){
        time = '07'
      }else{
        time = '01'
      }
    }

    if(dd<10) {
        dd = '0'+dd
    } 
    if(mm<10) {
        mm = '0'+mm
    } 
    chartDate = yyyy+'-'+mm+'-'+dd;
    console.log(chartDate)
    result = CHART_API(chartDate)
    result = result.replace('$time$', time)

    console.log(result)
    return result
  },
  messageReducer: async (error, result) => {
    return {
      type: 'image',
      originalContentUrl: (result),
      previewImageUrl: (result)
    }
  }
}
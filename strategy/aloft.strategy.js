const config = require('../config')
const ALOFT_API = (aloftDate) =>
  `https://www.tmd.go.th/programs/uploads/maps/${aloftDate}_$time$_UpperWind850.jpg`

exports.aloftStrategy = {
  test: /(aloft)|(Aloft)/,
  action: 'airports/aloft',
  /*mapToPayload: (event) => {
    const words = event.text.split(' ')
    return {
      aloftDate: words[2],
      hPa: words[1]
    }
  },*/
  resolve: async (action) => {

    var chartDate = new Date();
    var dd = chartDate.getDate()
    var mm = chartDate.getMonth()+1 //January is 0!
    var yyyy = chartDate.getFullYear()
    var hh = chartDate.getHours()
    var min = chartDate.getMinutes()
    var time
    if((hh<7) || (hh==7 && min<=10)){ //between 0000hrs - 0710hrs 
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
      if((hh>=19)&&(min>10)){
        time = 19
      }else{
        time = '07'
      }
    }

    aloftDate = yyyy+'-'+mm+'-'+dd;
    console.log(time)
    result = ALOFT_API(aloftDate)
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
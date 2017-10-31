require('isomorphic-fetch')
const metarStrategy = require('../airports.strategy').metarStrategy
const tafStrategy = require('../airports.strategy').tafStrategy
const notamStrategy = require('../airports.strategy').notamStrategy
const infoStrategy = require('../airports.strategy').infoStrategy

let msg = 'metar vtbd'
describe('Airport strategy test', () => {
  it('should return result from metar vtbd', async () => {
    const isMatch = metarStrategy.test.test(msg)
    expect(isMatch).toBeTruthy()

    const mapPayloadResult = await metarStrategy.mapToPayload({
      text: msg
    })
    expect(mapPayloadResult.airportName).toEqual('vtbd')

    const resolveResult = await metarStrategy.resolve({
      payload: mapPayloadResult
    })
    expect(resolveResult).toEqual(expect.anything())

    const responseMessage = await metarStrategy.messageReducer(undefined, resolveResult)

    console.log(responseMessage)
  })

  const taf_msg = 'taf vtbd'
  it('should return result from taf vtbd', async () => {
    const isMatch = tafStrategy.test.test(taf_msg)
    expect(isMatch).toBeTruthy()

    const mapPayloadResult = await tafStrategy.mapToPayload({
      text: taf_msg
    })
    expect(mapPayloadResult.airportName).toEqual('vtbd')

    const resolveResult = await tafStrategy.resolve({
      payload: mapPayloadResult
    })
    expect(resolveResult).toEqual(expect.anything())

    const resultMock = '101901894 13 TAF VTBD 251100Z 2512/2618 10005KT 9999 FEW020 BECMG 2514/2516 03005KT BECMG 2518/2520 32005KT 8000 BECMG 2601/2603 04010KT 9999 FEW020 SCT040 BECMG 2608/2610 32005KT FEW030 VTBD 2017-10-25T11:00:00Z 2017-10-25T11:00:00Z 2017-10-25T12:00:00Z 2017-10-26T18:00:00Z 13.92 100.6 3.0 2017-10-25T12:00:00Z 2017-10-25T14:00:00Z 100 5 6.21 2017-10-25T14:00:00Z 2017-10-25T18:00:00Z BECMG 2017-10-25T16:00:00Z 30 5 6.21 2017-10-25T18:00:00Z 2017-10-26T01:00:00Z BECMG 2017-10-25T20:00:00Z 320 5 4.97 2017-10-26T01:00:00Z 2017-10-26T08:00:00Z BECMG 2017-10-26T03:00:00Z 40 10 6.21 2017-10-26T08:00:00Z 2017-10-26T18:00:00Z BECMG 2017-10-26T10:00:00Z 320 5 6.21'
    const responseMessage = await tafStrategy.messageReducer(undefined, resultMock)
    expect(responseMessage.text).toEqual('TAF VTBD 251100Z 2512/2618 10005KT 9999 FEW020 BECMG 2514/2516 03005KT BECMG 2518/2520 32005KT 8000 BECMG 2601/2603 04010KT 9999 FEW020 SCT040 BECMG 2608/2610 32005KT FEW030 VTBD ')

    console.log(responseMessage)
  })

  const notam_msg = 'notam vtbd'
  it('should return result from notam vtbd', async () => {
    const isMatch = notamStrategy.test.test(notam_msg)
    expect(isMatch).toBeTruthy()

    const mapPayloadResult = await notamStrategy.mapToPayload({
      text: taf_msg
    })
    expect(mapPayloadResult.airportName).toEqual('vtbd')

    const resolveResult = await notamStrategy.resolve({
      payload: mapPayloadResult
    })
    expect(resolveResult).toEqual(expect.anything())

    // const resultMock = '101901894 13 TAF VTBD 251100Z 2512/2618 10005KT 9999 FEW020 BECMG 2514/2516 03005KT BECMG 2518/2520 32005KT 8000 BECMG 2601/2603 04010KT 9999 FEW020 SCT040 BECMG 2608/2610 32005KT FEW030 VTBD 2017-10-25T11:00:00Z 2017-10-25T11:00:00Z 2017-10-25T12:00:00Z 2017-10-26T18:00:00Z 13.92 100.6 3.0 2017-10-25T12:00:00Z 2017-10-25T14:00:00Z 100 5 6.21 2017-10-25T14:00:00Z 2017-10-25T18:00:00Z BECMG 2017-10-25T16:00:00Z 30 5 6.21 2017-10-25T18:00:00Z 2017-10-26T01:00:00Z BECMG 2017-10-25T20:00:00Z 320 5 4.97 2017-10-26T01:00:00Z 2017-10-26T08:00:00Z BECMG 2017-10-26T03:00:00Z 40 10 6.21 2017-10-26T08:00:00Z 2017-10-26T18:00:00Z BECMG 2017-10-26T10:00:00Z 320 5 6.21'
    // const responseMessage = await notamStrategy.messageReducer(undefined, resultMock)
    // expect(responseMessage.text).toEqual('TAF VTBD 251100Z 2512/2618 10005KT 9999 FEW020 BECMG 2514/2516 03005KT BECMG 2518/2520 32005KT 8000 BECMG 2601/2603 04010KT 9999 FEW020 SCT040 BECMG 2608/2610 32005KT FEW030 VTBD ')

    console.log(responseMessage)
  })
})

msg = 'info vtbd'
describe('Airport strategy test', () => {
  it('should return result from info vtbd', async () => {
    const isMatch = infoStrategy.test.test(msg)
    expect(isMatch).toBeTruthy()

    const mapPayloadResult = await infoStrategy.mapToPayload({
      text: msg
    })
    expect(mapPayloadResult.airportName).toEqual('vtbd')

    const resolveResult = await infoStrategy.resolve({
      payload: mapPayloadResult
    })
    expect(resolveResult).toEqual(expect.anything())

    const responseMessage = await infoStrategy.messageReducer(undefined, resolveResult)

    console.log(responseMessage)
  })
})

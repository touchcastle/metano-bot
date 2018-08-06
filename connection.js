require('dotenv').config({})
const db = require('./utils/db')


console.log(process.env.MONGODB_URL)
let c
module.exports = async () => {
    if (c) {
        return c
    }
    const isDev = process.env.NODE_ENV !== 'production'
    c = await db(
        process.env.MONGODB_URL,
        {
            inmemory: false,
            seed: isDev ? {
                'airport-notification': [
                    {
                        _id: 'seed-test-1',
                        USER_ID: 'Ue8f07e206af01de7cfa17418baf3a578',
                        airport: 'vtbd'
                    },
                    {
                        _id: 'seed-test-3',
                        USER_ID: 'Ue8f07e206af01de7cfa17418baf3a578',
                        airport: 'vtph'
                    }
                ]
            } : null
        }
    )
    c.on("connect", () => {
        console.log('connected')
    })
    return c
}
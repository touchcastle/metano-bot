const mongoose = require('mongoose')
const { URL } = require('url')
const { ObjectId } = require('bson')
const logger = console

let mongoServerInstance
let port = 9081
async function createInmemoryInstance(dbName) {
  return new Promise((resolve, reject) => {
    const MongoInMemory = require("mongo-in-memory")
    function work() {
      mongoServerInstance = new MongoInMemory(port) // DEFAULT PORT is 27017
      mongoServerInstance.start((error, config) => {
        if (error) {
          logger.log(`[db] fail to start inmemory db, CHECK IF THERE IS INSTANCE OF INMEMORY`)
          const mongouri = mongoServerInstance.getMongouri(dbName)
          console.log("current mongo inmem uri >>>", mongouri)
          if(mongouri) {
              return resolve(mongouri)
          }
          if (/EADDRINUSE/.test(error)) {
            port = port + 1
            setTimeout(work, 100)
          } else {
            reject(error)
          }
        } else {
          // callback when server has started successfully
          const mongouri = mongoServerInstance.getMongouri(dbName)
          logger.log(`[db] start inmemory db ${mongouri}`)
          resolve(mongouri)
        }
      })
    }
    work()
  })
}


async function seedData(connection, seeds) {
  for (const key of Object.keys(seeds)) {
    const data = seeds[key]
    logger.log(`[db] seed ${key} ${data.length} items `)
    await connection.collection(key).insertMany(data.map((d) => {

      // transform string to objectid
      // if valid
      for (const k of Object.keys(d)) {
        if (ObjectId.isValid(d[k]) && d[k].length === 24) {
          d[k] = new ObjectId(d[k])
        }
      }
      return d
    }))
  }
}

module.exports = async function getDatabaseConnection(connectionURL, options = { inmemory: false })  {
  if (options.inmemory) {
    const url = new URL(connectionURL)
    connectionURL = await createInmemoryInstance(url.pathname.split("/")[1])
  }

  return new Promise(async (resolve, reject) => {
    const connection = mongoose.createConnection(connectionURL, { poolSize: 5 })

    connection.on("connected", async () => {

      logger.log("[db] init connection !!")
      // seed data from options
      if (options.seed) {
        logger.log("[db] seed data from options")
        const isSeed = await connection.collection('seedlog').find().toArray()
        if(isSeed.length > 0) {
          console.log('seeded, skip seed')
        } else {
          await seedData(connection, options.seed)
          await connection.collection('seedlog').insert({_id: 'SEEDED'})
        }

      }

      logger.log("[db] database is ready to use")
      resolve(connection)
    })

    connection.on("disconnected", () => {
      logger.log("[db] disconnected !")
      if (mongoServerInstance) {
        mongoServerInstance.stop((error) => {
          if (error) {
            console.error(error)
          } else {
            // callback when server has stopped successfully
            logger.log("[db] Mongoinmemory peacefully stop...")
            
          }
        })
      }
    })
    process.on("SIGINT", async () => {
      logger.log("[db] SIGINT... disconnected")
      await connection.close()
      process.exit(0)
    })
    process.on("SIGTERM", async () => {
      logger.log("[db] SIGINT... disconnected")
      await connection.close()
      process.exit(0)
    })
  })

}
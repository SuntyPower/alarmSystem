const mosca = require('mosca');
const db = require('alarma-db');
const { parsePayload } = require('./utils')
const redis = require('redis');

const backend = {
  type: 'redis',
  redis,
  return_buffers:true
}


const settings = {
  port: 1883,
  backend
}

const config = {
    database: process.env.DB_NAME || 'alarm',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'ieochj28',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  }


const server= new mosca.Server(settings)

const clients = new Map()

let Device,Report


server.on('clientConnected', client => {
  console.log(`Client Connected: ${client.id}`)

  clients.set(client.id, null)
})

server.on('clientDisconnected', async (client) => {
  console.log(`Client Disconnected: ${client.id}`)
  const device = clients.get(client.id)

  if (device) {
    // Mark Device as Disconnected
    device.state = 0;

    try {
      await Device.createOrUpdate(device)
    } catch (e) {
      return handleError(e)
    }

    // Delete Device from Clients List
    clients.delete(client.id)

    server.publish({
      topic: 'device/disconnected',
      payload: JSON.stringify({
        device: {
          uuid: device.uuid
        }
      })
    })

    console.log(`Client (${client.id}) associated to Device (${device.uuid}) marked as disconnected`)
  }
})




server.on('published', async (packet, client) => {
  console.log(`Received: ${packet.topic}`)

  switch (packet.topic) {    
    case 'device/message':
      console.log(`mesage Payload: ${packet.payload}`)

      const payload = parsePayload(packet.payload)
      console.log("decode payload",payload);
      const exist= await Device.findByUuid(payload.device.uuid).catch((err) => {})

      if (payload && exist ) {

        let device,report
        try {
          device = await Device.update(payload.device)
        } catch (e) {
         console.log(e);
       }

        console.log(`device ${payload.device.uuid} saved`)

        // Notify Device is Connected
        if (!clients.get(client.id)) {
          clients.set(client.id, device)
          server.publish({
            topic: 'device/connected',
            payload: JSON.stringify({
              device: {
                uuid: device.uuid,
                zones: device.zones,
                version:device.version,
                state:device.state
              }

            })
          })
        }

        // Store Reports
        try {
        console.log("almacenando report", payload.report)

        const report=await Report.create(device.uuid, payload.report)
        } catch (e) {
          return handleError(e)
        }

      }

      if(!payload){
      console.log("no hay playload")
    }

      break
  }
})



server.on('ready', async () => {
  const services = await db(config).catch(handleFatalError)

  Device = services.Device
  Report = services.Report

  console.log(`[platziverse-mqtt] server is running at port ${settings.port} `)
})


server.on('error', handleFatalError)


function handleFatalError (err) {
  console.error(`[fatal error] ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

function handleError (err) {
  console.error(`'[error]' ${err.message}`)
  console.error(err.stack)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

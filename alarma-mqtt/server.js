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
    database: process.env.DB_NAME || 'alarma',
    username: process.env.DB_USER || 'guille',
    password: process.env.DB_PASS || 'guilleqwe',
    host: process.env.DB_HOST || '192.168.1.109',
    dialect: 'mysql'
  }


const server= new mosca.Server(settings)

const clients = new Map()

let Device,Report


server.on('clientConnected', client => {
 //todo

})

server.on('clientDisconnected', async (client) => {
//todo

})




server.on('published', async (packet, client) => {

  console.log(`Received: ${packet.topic}`)
  switch (packet.topic) {

    case 'sensor/motion':
        console.log('Device reportando sensores');
        console.log(`message Payload: ${packet.payload}`)
        const payload = parsePayload(packet.payload)
        console.log("decode payload to JSON: ",payload);
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

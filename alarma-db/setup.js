  'use strict'


const db = require('./')

setup()


async function setup (){

const config = {
    database: process.env.DB_NAME || 'alarma',
    username: process.env.DB_USER || 'guille',
    password: process.env.DB_PASS || 'guilleqwe',
    host: process.env.DB_HOST || '192.168.1.109',
    dialect: 'mysql',
    setup: true
}

await db(config).catch(handleFatalError)
console.log('Success!')
  process.exit(0)

}

function handleFatalError (err) {
  console.error(`Ocurrio un error --> err.message`)
  console.error(err.stack)
  process.exit(1)
}

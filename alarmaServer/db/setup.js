'use strict'


const db = require('./')

setup()


async function setup (){

const config = {
  database: process.env.DB_NAME || 'alarma_database',
    username: process.env.DB_USER || 'guille',
    password: process.env.DB_PASS || '886432077',
    host: process.env.DB_HOST || 'claragestion.com',
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

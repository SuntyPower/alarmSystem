'use strict'


const db = require('./')

setup()


async function setup (){

const config = {
  database: process.env.DB_NAME || 'alarm',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'ieochj28',
    host: process.env.DB_HOST || 'localhost',
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

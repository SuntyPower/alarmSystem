'use strict'


const http = require('http')
const express = require('express')
const port = process.env.PORT || 3000
const app =express()
const api = require('./api');
const server = http.createServer(app)
const io = require('socket.io')(server)
const db = require('alarma-db')
const uuid = require('uuid/v1')
const random  = require('random-js')()
const bodyParser = require('body-parser');
const config = require('./config');


app.use('/api',api)



app.use((err, req, res, next) => {
  console.log(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})



function handleFatalError (err) {
  console.error(`[fatal error] ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}


if (!module.parent) {
  process.on('uncaughtException', handleFatalError)
  process.on('unhandledRejection', handleFatalError)

  server.listen(port, () => {
    console.log(`[alarma-app] server listening on port ${port}`)
  })
}

module.exports = server

const express    = require('express');

//for test
const api= express.Router()



let Device,Report,services








//filtra reportes por uuid de Dispositivo




function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

module.exports=api

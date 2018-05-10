const express    = require('express');

//for test
const api= express.Router()
const db = require('alarma-db')
const config = require('./config')


let Device,Report,services

api.use('*', async (req, res, next) => {

  if (!services) {
    console.log('Connecting to database')
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e)
    }

    Device = services.Device
    Report = services.Report
  }
  next()
})


api.get('/test',async (req,res)=>{
    const reports= await Report.findAll()
    const devices = await Device.findAll()
    res.send(`los Devices son ${JSON.stringify(devices)} \n y los reports son ${JSON.stringify(reports)}`)

})


api.get('/test/createReport/:uuid',async(req,res)=>{

 const report=await Report.create(req.params.uuid,{
  zone: 2,
  events: 2,
  type: 2
}).catch((err) => {
  res.send(err)

});
res.send(report)
next()
})


api.get('/test/:uuid',(req,res)=>{
res.send( `Funciona ${req.params.uuid}`)
next()
})



//filtra reportes por uuid de Dispositivo




function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

module.exports=api

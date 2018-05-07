'use strict'


const http = require('http')
const express = require('express')
const port = process.env.PORT || 3000
const app =express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const db = require('alarma-db')
const uuid = require('uuid/v1')
const random  = require('random-js')()
const bodyParser = require('body-parser');
const config = require('./config');


let Device,Report,services
run()

io.on('connection',async function(socket){
  console.log("connect");
  const devices= await Device.findAll().catch(handleFatalError)
    io.emit('devices', devices)
//    updateTime().catch(handleFatalError)
});


async function run(){
  if (!services) {
    console.log('Connecting to database')
    try {
      services = await db(config.db)
      Device= services.Device
      Report = services.Report
    } catch (e) {
      console.log(e);
    }
  }
  console.log("hellouu  ");

}

//crea un usuario nuevo si no existe
app.post('/report',async function(req, res){
    const uuid=req.body.uuid
    const zone=req.body.zone
    const  events= req.body.event
    const type = req.body.type

    if(Device.findByUuid(uuid)){
    const report = Report.create(uuid,{
      zone,
      events,
      type
    }).catch(handleFatalError)


    console.log(`Device created  with ${uuid} ${zones} ${version} ${state} `)
    io.emit('report', report )
    res.send(report)}else {
      res.send(`error el ${uuid} no existe`)
    }
})

app.get('findByDeviceUuid/:uuid',async function(req, res){
      const uuid=req.parms.uuid
   console.log(uuid);
   res.send(Device.find(uuid));

});




app.post('/post/createDevice',async function(req, res){
    const uuid=req.body.uuid
    const zones=req.body.zones
    const version= req.body.version
    const state = req.body.state

    if(!Device.findOne(uuid)){
    const device = await Device.create({
      uuid,
      zones,
      version,
      state
    }).catch(handleFatalError)

    io.emit('device', device)
    console.log(`Device created  with ${uuid} ${zones} ${version} ${state} `)
    res.send(device)}else {
      res.send("error ese uuid ya esta en uso")
    }
});


app.post('/post/createDevice',async function(req, res){
    const uuid=req.body.uuid
    const zones=req.body.zones
    const version= req.body.version
    const state = req.body.state

    if(!Device.findOne(uuid)){
    const device = await Device.create({
      uuid,
      zones,
      version,
      state
    }).catch(handleFatalError)

    console.log(`Device created  with ${uuid} ${zones} ${version} ${state} `)
    res.send(device)}else {
      res.send("error ese uuid ya esta en uso")
    }
});























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

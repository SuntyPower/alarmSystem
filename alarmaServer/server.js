const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const db = require('./db')
const uuid = require('uuid/v1')
//for test
const random = require('random-js')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
//const server= http.createServer(app)


run()

async function run () {
  const config = {
    database: process.env.DB_NAME || 'alarma_database',
      username: process.env.DB_USER || 'guille',
      password: process.env.DB_PASS || '886432077',
      host: process.env.DB_HOST || 'claragestion.com',
      dialect: 'mysql'
  }

const {Device,Report} = await db(config).catch(err => {console.log(err)})

const device= await Device.create({
  uuid: uuid(),
  zones: random.integer(1,4),
  version:0,
  state: random.integer(1,4)
}).catch(handleFatalError)


console.log("\n\nMis Dispositivos son\n");
const devices= await Device.findAll().catch(handleFatalError)
console.log(devices);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(app.router);
//app.use('/', express.static(__dirname + '/node_modules/gentelella/production/'));
app.use('/nodejs', express.static( __dirname + '/node_modules'));
app.use(express.static(__dirname  +"/node_modules/public"))

app.get('/', function (req, res) {

    res.sendFile('index.html');

});







io.on('connection',async function(socket){
  const devices= await Device.findAll().catch(handleFatalError)
    io.emit('devices', devices)
//    updateTime().catch(handleFatalError)
});





app.post('/api/post/createDevice',async function(req, res){
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
    io.emit('device', device)
    res.send(device)}else {
      res.send("error ese uuid ya esta en uso")
    }
});



//crea un usuario nuevo si no existe
app.post('/api/post/report',async function(req, res){
    const uuid=req.body.uuid
    const zone=req.body.zone
    const events= req.body.event
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


//filtra reportes por uuid de Dispositivo
app.post('/api/post/findByDeviceUuid',async function(req, res){
    const uuid=req.body.uuid

    console.log(`${uuid} ${zones} ${version} ${state} sucess!`)

    const reports = await Report.findByDeviceUuid()
    io.emit('findByDeviceUuid', reports)
    res.send(reports)
});






function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

//connection.end();
http.listen(3000, function () {
console.log('Example app listening on port 3000');
});
}

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const db = require('./db')
const uuid = require('uuid/v1')
//for test
const random = require('random-js')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

run()

async function run () {
  const config = {
    database: process.env.DB_NAME || 'alarm',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'ieochj28',
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql'
  }

const {Device,Report} = await db(config).catch(err => {console.log(err)})

const device= await Device.create({
  uuid: uuid(),
  zones: random.integer(1,10),
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
app.use(express.static('public'));


app.get('/', function (req, res) {

    res.sendFile('/index.html');

});



io.on('connection',async function(socket){
  const devices= await Device.findAll().catch(handleFatalError)
    io.emit('devices', devices)
});


app.post('/api/posts',async function(req, res){
    const uuid=req.body.uuid
    const zones=req.body.zones
    const version= req.body.version
    const state = req.body.state

    console.log(`${uuid} ${zones} ${version} ${state} sucess!`)
    const device = await Device.create({
      uuid,
      zones,
      version,
      state
    }).catch(handleFatalError)

    io.emit('new Device', device)


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

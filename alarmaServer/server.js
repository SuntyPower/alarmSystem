const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const db = require('./')

run()
async function run (){
const config = {
  database: 'admin_test1',
  username: 'admin_guille',
  password:  'guille',
  host:  '192.168.1.109',
  dialect: 'mysql'
}

const Device = await db(config).catch(err => {console.log(err)})

const device= Device.createOrUpdate({
  uuid: "guille",
  zones: 3,
  version:2,
  state: 1
})



console.log(device);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(app.router);
app.use(express.static('public'));


app.get('/', function (req, res) {

    res.sendFile(__dirname + '/index.html');

});


app.post('/api/posts', function(req, res){

    const username=req.body.username;
    const zone=req.body.zone;

    res.send(`${username} ${zone} sucess!`);
    Device.createOrUpdate({
      username,
      zone
    })
});

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

//connection.end();
app.listen(3000, function () {
console.log('Example app listening on port 3000');
});

}

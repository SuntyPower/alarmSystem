'use strict';


const setupDatabase = require('./db');
const setupDeviceModel = require('./models/DeviceModel')
const setupDevice = require('./device')
const defaults = require('defaults');



module.exports = async function(config){

  config = defaults(config, {
  dialect: 'mysql',
    operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }})


const sequelize = setupDatabase(config)
const DeviceModel = setupDeviceModel(config)

await sequelize.authenticate()

await sequelize.sync({ force: true })
console.log("sync");


const  Device = setupDevice(DeviceModel)

return Device



}

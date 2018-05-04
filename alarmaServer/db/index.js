'use strict';


const defaults = require('defaults')


//init of the db
const setupDatabase = require('./logs/db')

//import Models
const setupDeviceModel = require('./models/DeviceModel')
const setupReportModel = require('./models/ReportModel')
const setupUserModel = require('./models/UserModel')

//Import Function of the models
const setupDevice = require('./logs/device')
const setupReport = require('./logs/user')
const setupUser = require('./logs/user')




module.exports = async function(config){

  config = defaults(config, {
  dialect: 'mysql',
    operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },query: {
      raw: true
    }
})




//initialize sequelize
const sequelize = setupDatabase(config)

//create TABLE MODELS
const DeviceModel = setupDeviceModel(config)
const ReportModel = setupReportModel(config)
//const UserModel = setupUserModel(config)

//tables Dependencies
    //UserModel.hasMany(DeviceModel)
    //DeviceModel.belongsTo(UserModel)

DeviceModel.hasMany(ReportModel)
ReportModel.belongsTo(DeviceModel)


await sequelize.authenticate()
  if (config.setup) {
await sequelize.sync({ force: true })
console.log("sync");
}

//import and exports of Functions of the DB
const Device = setupDevice(DeviceModel)
const Report = setupReport(DeviceModel , ReportModel)
  //const User = setupUser(UserModel, DeviceModel)

return {
  Device,
  Report
}



}

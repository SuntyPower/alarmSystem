
const Sequelize = require('sequelize');
const setupDb = require('../db')




module.exports = function setupDatabase (config) {
  const sequelize = setupDb(config)


  sequelize.define('device', {
    username: {
      type: Sequelize.STRING
      },
    zone: {
      type: Sequelize.STRING
    }
    })


return sequelize.define('device', {
  username: {
    type: Sequelize.STRING
    },
  zone: {
    type: Sequelize.STRING
  }
  })


}

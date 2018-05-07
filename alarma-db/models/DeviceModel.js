
const Sequelize = require('sequelize');
const setupDb = require('../logs/db')




module.exports = function setupDatabase (config) {
  const sequelize = setupDb(config)


return sequelize.define('device',{
  uuid:{
    type: Sequelize.STRING
  },
  zones:{
    type: Sequelize.INTEGER
  },
  version:{
    type: Sequelize.INTEGER
  },
  state:{
    type: Sequelize.INTEGER
  }
})
}


const Sequelize = require('sequelize');
const setupDb = require('../logs/db')





module.exports = function setupDatabase (config) {
  const sequelize = setupDb(config)


return sequelize.define('report',{
  zone:{
    type: Sequelize.INTEGER
  },
  events:{
    type: Sequelize.INTEGER
  },
  type:{
    type: Sequelize.INTEGER
  }
})
}

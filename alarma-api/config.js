'use strict'

module.exports = {
  db: {
    database: process.env.DB_NAME || 'alarm',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'ieochj28',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
  },
  auth: {
    secret: process.env.SECRET || 'platzi'
  }
}

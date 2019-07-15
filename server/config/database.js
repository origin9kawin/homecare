const Sequelize = require('sequelize');
module.exports = new Sequelize('database_development', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    accuire: 30000,
    idle: 10000
  },
  dialectOptions: {
    // useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: true
  },
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    // freezeTableName: true,
    // underscored: true,
    // timestamps: false
  },
  timezone: '+07:00' //for writing to database
})
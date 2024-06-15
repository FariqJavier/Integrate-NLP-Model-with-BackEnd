const { Sequelize } = require('sequelize');
const logger = require('./logger');
const mysql2 = require('mysql2');
require('dotenv').config(); 

const connect = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: 3306,
  dialectModule: mysql2,
  logging: (sql, timing) => {
    // Logika logging khusus Anda di sini
    logger.warn(sql); // Log query SQL yang dihasilkan
    logger.warn(`Query took ${timing}ms`); // Log waktu eksekusi query (opsional)
  },
});

connect.authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });

module.exports = connect;
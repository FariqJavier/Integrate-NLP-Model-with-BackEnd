const { Sequelize } = require('sequelize');
const logger = require('./logger');
const mysql2 = require('mysql2');

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

module.exports = connect;
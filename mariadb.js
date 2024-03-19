const mariadb = require('mysql2');
// const mariadb = require('mysql2/promise');

const connection = mariadb.createConnection({
  // host: '172.30.149.107',
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'BookShop',
  dateStrings: true,
});

module.exports = connection;

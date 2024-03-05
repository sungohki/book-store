const mariadb = require('mysql2/promise');

const connection = async () =>
  await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'BookShop',
    dateStrings: true,
  });

module.exports = connection;

const { readRes } = require('../../controller/ResponseController');
const conn = require('../../mariadb');

const allCategory = (req, res) => {
  const sql = `SELECT * FROM category`;
  conn.query(sql, (err, results) => readRes(res, err, results));
};

module.exports = allCategory;

const { readRes } = require('../../controller/ResponseController');
const conn = require('../../mariadb');

const userPwResetRequest = (req, res) => {
  const { email } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;
  const values = [email];

  conn.query(sql, values, (err, results) => readRes(res, err, results));
};

module.exports = userPwResetRequest;

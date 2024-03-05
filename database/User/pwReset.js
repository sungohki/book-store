const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');
const crypto = require('crypto');

const userPwReset = (req, res) => {
  const { email, password } = req.body;
  const sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`;
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('base64');
  const values = [hashedPassword, salt, email];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.affectedRows) {
      res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      res.status(StatusCodes.OK).json(results);
    }
  });
};

module.exports = userPwReset;

const conn = require('../../mariadb');
const crypto = require('crypto');
const { updateRes } = require('../../controller/ResponseController');

const userPwReset = (req, res) => {
  const { email, password } = req.body;
  const sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`;
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('base64');
  const values = [hashedPassword, salt, email];

  conn.query(sql, values, (err, results) => updateRes(res, err, results));
};

module.exports = userPwReset;

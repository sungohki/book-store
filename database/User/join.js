const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');
const crypto = require('crypto');

const userJoin = (req, res) => {
  const { email, name, password, contact } = req.body;

  // Info: Hashing password
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('base64');

  const sql = `
    INSERT INTO 
      users 
      (email, name, password, salt, contact) 
    VALUES 
      (?, ?, ?, ?, ?)`;
  const values = [email, name, hashedPassword, salt, contact];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

module.exports = userJoin;

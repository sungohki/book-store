const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();

const userLogin = (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;
  const values = [email];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const loginUser = results[0];

    // TODO: Checking password
    const hashedPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 64, 'sha512')
      .toString('base64');

    if (loginUser && loginUser.password == hashedPassword) {
      // TODO: Publish jwt token
      const instanceToken = jwt.sign(
        {
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '5m',
          issuer: 'sungohki',
        }
      );
      // TODO: Add jwt token on cookie
      res.cookie('token', instanceToken, {
        httpOnly: true,
      });
      console.log(token); // Check token
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

module.exports = userLogin;

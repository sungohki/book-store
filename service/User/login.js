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
      // 1) jwt 토큰 발행
      const instanceToken = jwt.sign(
        {
          id: loginUser.id,
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          // expiresIn: '1m' /* Expire Test */,
          expiresIn: '10m' /* Expire Test */,
          issuer: 'sungohki',
        }
      );
      // 2) 쿠키에 토큰 첨부
      res.cookie('token', instanceToken, {
        httpOnly: true,
      });
      return res
        .status(StatusCodes.OK)
        .json({ ...results[0], token: instanceToken });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

module.exports = userLogin;

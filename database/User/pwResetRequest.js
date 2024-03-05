const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');

const userPwResetRequest = (req, res) => {
  const { email } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;
  const values = [email];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({
        email: email,
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

module.exports = userPwResetRequest;

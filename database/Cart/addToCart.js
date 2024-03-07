const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');
const jwt = require('jsonwebtoken');

const addToCart = (req, res) => {
  const { book_id, quantity } = req.body;
  const decodedJwt = decodeJwt(req, res);

  if (decodedJwt instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션 만료. 다시 로그인 하세요.',
    });
  } else if (decodedJwt instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '잘못된 토큰 입니다.',
    });
  }

  const sql = `
    INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);
  `;
  const values = [book_id, quantity, decodedJwt.id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = addToCart;

const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');
const jwt = require('jsonwebtoken');

const viewCartItems = (req, res) => {
  const { selected } = req.body;
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

  let sql = `
    SELECT 
        cartItems.id, book_id, title, summary, quantity, price
    FROM
        cartItems
            LEFT JOIN
        books ON cartItems.book_id = books.id
        WHERE user_id = ?
  `;
  const values = [decodedJwt.id];
  if (selected && selected.length) {
    sql += ` AND cartItems.id IN (?)`;
    values.push(selected);
  }

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = viewCartItems;

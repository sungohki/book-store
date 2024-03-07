const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');

const addToCart = (req, res) => {
  const { book_id, quantity } = req.body;
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;

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

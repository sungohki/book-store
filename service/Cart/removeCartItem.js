const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');

const removeCartItem = (req, res) => {
  const cartItem_id = req.params.id;
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;

  const sql = `DELETE FROM cartItems WHERE id = ?`;
  const values = [cartItem_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.affectedRows) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
  });
};

module.exports = removeCartItem;

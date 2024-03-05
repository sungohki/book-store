const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');

const removeCartItem = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM cartItems WHERE id = ?`;
  const values = [id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = removeCartItem;

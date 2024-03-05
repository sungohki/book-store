const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');

const getOrderItemDetail = (req, res) => {
  const { book_id, quantity, user_id } = req.body;
  const sql = `
    INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);
  `;
  const values = [book_id, quantity, user_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    delivery_id = results.insertId;
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = getOrderItemDetail;

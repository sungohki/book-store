const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');

const getOrderItemDetail = (req, res) => {
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;
  const order_id = req.params.id;
  const sql = `
    SELECT 
        book_id, title, author, price, quantity
    FROM
        orderedBook
            LEFT JOIN
        books ON orderedBook.book_id = books.id
    WHERE
        orderedBook.id = ?;
  `;
  const values = [order_id];

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

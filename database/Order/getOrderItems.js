const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');

const getOrderItems = (req, res) => {
  const sql = `
    SELECT 
        orders.id as order_id, created_at, address, receiver, contact, book_title, total_quantity, total_price
    FROM
        orders
            LEFT JOIN
        delivery ON orders.delivery_id = delivery.id;
  `;

  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = getOrderItems;

const { readRes } = require('../../controller/ResponseController');
const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');

const getOrderItems = (req, res) => {
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;
  const sql = `
    SELECT 
        orders.id as order_id, created_at, address, receiver, contact, book_title, total_quantity, total_price
    FROM
        orders
            LEFT JOIN
        delivery ON orders.delivery_id = delivery.id
    WHERE
        orders.user_id = ?;
  `;
  const values = [decodedJwt.id];
  conn.query(sql, values, (err, results) => readRes(res, err, results));
};

module.exports = getOrderItems;

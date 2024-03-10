const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');
const { readRes } = require('../Common/readRes');

const viewCartItems = (req, res) => {
  const { selected } = req.body;
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;

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

  conn.query(sql, values, (err, results) => readRes(res, err, results));
};

module.exports = viewCartItems;

const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');
const readRes = require('../Common/readRes');

const viewDetail = (req, res) => {
  const receivedToken = req.headers['authorization'];
  const book_id = req.params.id;

  let values = [];
  let sql = `SELECT *,
    (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) 
     AS likes`;
  if (receivedToken) {
    const decodedJwt = decodeJwt(req, res);
    if (!decodedJwt) return;
    sql += `, (SELECT EXISTS 
      (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?))
      AS liked `;
    values = [decodedJwt.id, book_id];
  }
  sql += ` FROM books 
    LEFT JOIN category 
    ON books.category_id = category.category_id 
    WHERE books.id = ?`;
  values = [...values, book_id];

  conn.query(sql, values, (err, results) => readRes(res, err, results[0]));
};

module.exports = viewDetail;

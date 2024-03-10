const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');

const viewDetail = (req, res) => {
  const decodedJwt = decodeJwt(req, res);
  const book_id = req.params.id;

  let values = [];
  let sql = `SELECT *,
    (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) 
     AS likes`;
  if (decodedJwt) {
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

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const goalBook = results[0];
    if (goalBook) {
      return res.status(StatusCodes.OK).json(goalBook);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

module.exports = viewDetail;

const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');

const NEW_BOOK_CRITERIA = 3;

const viewAll = (req, res) => {
  const { category_id, news, limit, currentPage } = req.query;
  let sql = `SELECT *,
    (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes 
    FROM books
  `;
  let values = [];
  if (category_id || news) {
    sql += ` WHERE `;
    if (category_id && news) {
      sql += `category_id = ? AND 
        pub_date BETWEEN 
        DATE_SUB(NOW(), INTERVAL ${NEW_BOOK_CRITERIA} MONTH) AND NOW()`;
      values = [category_id];
    } else if (category_id) {
      sql += `category_id = ?`;
      values = [category_id];
    } else if (news) {
      sql += `pub_date BETWEEN 
        DATE_SUB(NOW(), INTERVAL ${NEW_BOOK_CRITERIA} MONTH) AND NOW()`;
    }
  }
  sql += `LIMIT ? OFFSET ?`;
  values = [...values, parseInt(limit), limit * (currentPage - 1)];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.length) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};
module.exports = viewAll;

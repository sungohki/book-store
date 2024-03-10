const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');
const dotenv = require('dotenv');
dotenv.config();

const NEW_BOOK_CRITERIA = process.env.NEW_BOOK_CRITERIA;

const viewAll = (req, res) => {
  const { category_id, news, limit, currentPage } = req.query;
  let resBooks;
  let sql = `SELECT SQL_CALC_FOUND_ROWS *,
    (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes 
    FROM books
  `;
  let values = [];

  // 1) View all books with `Limit` & `Offset
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
    }
    if (results.length) {
      resBooks = results;
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });

  // 2) count `totalCount`
  sql = `SELECT found_rows() AS totalCount`;

  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json({
      books: resBooks,
      pagination: {
        currentPage: parseInt(currentPage),
        totalCount: results[0].totalCount,
      },
    });
  });
};
module.exports = viewAll;

const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');

const viewDetail = (req, res) => {
  const { id: book_id } = req.params;
  const { user_id } = req.body;
  const sql = `SELECT *,
    (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) 
     AS likes,
    (SELECT EXISTS 
      (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?))
     AS liked
    FROM books 
    LEFT JOIN category 
    ON books.category_id = category.category_id 
    WHERE books.id = ?`;
  const values = [user_id, book_id, book_id];

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

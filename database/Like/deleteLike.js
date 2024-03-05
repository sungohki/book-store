const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');

const deleteLike = (req, res) => {
  const { id: liked_book_id } = req.params;
  const { user_id } = req.body;
  const sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;`;
  const values = [user_id, liked_book_id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = deleteLike;

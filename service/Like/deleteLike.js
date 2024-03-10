const { deleteRes } = require('../../controller/ResponseController');
const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');
const dotenv = require('dotenv');
dotenv.config();

const deleteLike = (req, res) => {
  const book_id = req.params.id;
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;

  const sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;`;
  const values = [decodedJwt.id, book_id];
  conn.query(sql, values, (err, results) => deleteRes(res, err, results));
};

module.exports = deleteLike;

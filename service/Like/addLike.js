const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');
const { createRes } = require('../../controller/ResponseController');

const addLike = (req, res) => {
  const book_id = req.params.id;
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;

  const sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);`;
  const values = [decodedJwt.id, book_id];
  conn.query(sql, values, (err, results) => createRes(res, err, results));
};

module.exports = addLike;

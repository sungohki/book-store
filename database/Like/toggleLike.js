const { StatusCodes } = require('http-status-codes');
const { decodeJwt } = require('../../hooks/decodeJwt');
const mariadb = require('mysql2/promise');

const toggleLike = async (req, res) => {
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;
  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'BookShop',
    dateStrings: true,
  });
  const book_id = req.params.id;

  let sql, values, results;

  // 0) Liked Check
  sql = `SELECT EXISTS 
      (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)
      AS liked`;
  values = [decodedJwt.id, book_id];
  const [rows, fields] = await conn.query(sql, values);

  if (rows[0].liked) {
    // 1) Delete Like
    sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;`;
    values = [decodedJwt.id, book_id];
  } else {
    // 2) Add Like
    sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);`;
    values = [decodedJwt.id, book_id];
  }
  results = await conn.query(sql, values);
  return res.status(StatusCodes.OK).json(results[0]);
};

module.exports = toggleLike;

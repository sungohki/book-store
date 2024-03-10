const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');
const { createRes } = require('../../controller/ResponseController');

const addToCart = (req, res) => {
  const { book_id, quantity } = req.body;
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;
  const sql = `
    INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);
  `;
  const values = [book_id, quantity, decodedJwt.id];
  conn.query(sql, values, (err, results) => createRes(res, err, results));
};

module.exports = addToCart;

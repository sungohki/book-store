const conn = require('../../mariadb');
const { decodeJwt } = require('../../hooks/decodeJwt');
const { deleteRes } = require('../../controller/ResponseController');

const removeCartItem = (req, res) => {
  const cartItem_id = req.params.id;
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;
  const sql = `DELETE FROM cartItems WHERE id = ?`;
  const values = [cartItem_id];
  conn.query(sql, values, (err, results) => deleteRes(res, err, results));
};

module.exports = removeCartItem;

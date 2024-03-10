const { StatusCodes } = require('http-status-codes');
const { decodeJwt } = require('../../hooks/decodeJwt');
const mariadb = require('mysql2/promise');

const getOrderItemDetail = async (req, res) => {
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;

  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'BookShop',
    dateStrings: true,
  });
  const order_id = req.params.id;

  // 0) order_id에 해당하는 주문의 user_id가 토큰의 id와 동일한지 비교
  let sql = `
    SELECT 
        user_id
    FROM
        orders
    WHERE
        orders.id = ? 
  `;
  let values = [order_id];
  let [results] = await conn.query(sql, values);
  if (results[0] && results[0].user_id != decodedJwt.id) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send('#info: UserId and OrderItemsId not match')
      .end();
  }

  // 1) 주문 상세 내역 조회
  sql = `
    SELECT 
        book_id, title, author, price, quantity
    FROM
        orderedBook
            LEFT JOIN
        books ON orderedBook.book_id = books.id
    WHERE
        orderedBook.id = ?;
  `;
  values = [order_id];
  [results] = await conn.query(sql, values);
  return res.status(StatusCodes.OK).json(results[0]);
};

module.exports = getOrderItemDetail;

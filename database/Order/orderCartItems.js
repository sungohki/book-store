const { StatusCodes } = require('http-status-codes');
const mariadb = require('mysql2/promise');

const orderCartItems = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'BookShop',
    dateStrings: true,
  });
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  // 1) delivery 테이블 튜플 추가
  let sql = `
    INSERT INTO delivery (address, receiver, contact)
    VALUES (?, ?, ?)
  `;
  let values = [delivery.address, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, values);
  console.log(results);
  const deliveryId = results.insertId;

  // 2) orders 테이블 튜플 추가
  sql = `
        INSERT INTO orders
            (book_title, total_quantity, total_price, user_id, delivery_id)
            values (?, ?, ?, ?, ?)
    `;
  values = [firstBookTitle, totalQuantity, totalPrice, userId, deliveryId];
  [results] = await conn.execute(sql, values);
  const orderId = results.insertId;

  // 3) orderedBook 테이블 튜플 추가
  sql = `INSERT INTO orderedBook
    (order_id, book_id, quantity)
    VALUES ?
  `;
  values = [];
  items.forEach((cartItem) => {
    values.push([orderId, cartItem.bookId, cartItem.quantity]);
  });
  results = await conn.query(sql, [values]);
  return res.status(StatusCodes.OK).json(results[0]);
};

module.exports = orderCartItems;

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
  const {
    items,
    delivery,
    total_quantity,
    total_price,
    user_id,
    first_book_title,
  } = req.body;

  // 1) delivery 테이블 튜플 추가
  let sql = `
    INSERT INTO delivery (address, receiver, contact)
    VALUES (?, ?, ?)
  `;
  let values = [delivery.address, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, values);
  console.log(results);
  const delivery_id = results.insertId;

  // 2) orders 테이블 튜플 추가
  sql = `
        INSERT INTO orders
            (book_title, total_quantity, total_price, user_id, delivery_id)
            values (?, ?, ?, ?, ?)
    `;
  values = [
    first_book_title,
    total_quantity,
    total_price,
    user_id,
    delivery_id,
  ];
  [results] = await conn.execute(sql, values);
  const order_id = results.insertId;

  // 3) orderedBook 테이블 튜플 추가
  sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
  const [orderItems, fields] = await conn.query(sql, [items]);

  sql = `INSERT INTO orderedBook
    (order_id, book_id, quantity)
    VALUES ?
  `;
  values = [];
  orderItems.forEach((item) => {
    values.push([order_id, item.book_id, item.quantity]);
  });
  results = await conn.query(sql, [values]);
  await deleteCartItems(conn, items);
  return res.status(StatusCodes.OK).json(results[0]);
};

const deleteCartItems = async (conn, items) => {
  const sql = `DELETE FROM cartItems WHERE id IN (?)`;
  const result = await conn.query(sql, [items]);
  return result;
};

module.exports = orderCartItems;

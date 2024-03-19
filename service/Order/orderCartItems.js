const { StatusCodes } = require('http-status-codes');
const mariadb = require('mysql2/promise');
const { decodeJwt } = require('../../hooks/decodeJwt');

const orderCartItems = async (req, res) => {
  const decodedJwt = decodeJwt(req, res);
  if (!decodedJwt) return;

  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'BookShop',
    dateStrings: true,
  });
  const { items, delivery, total_quantity, total_price, first_book_title } =
    req.body;
  let sql, values;

  // 0) cartItem 테이블 튜플 확인
  sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
  const [orderItems, fields] = await conn.query(sql, [items]);

  if (!orderItems.length) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '잘못된 요청입니다. 해당되는 주문이 없습니다.',
    });
  }

  // 1) delivery 테이블 튜플 추가
  sql = `
    INSERT INTO delivery (address, receiver, contact)
    VALUES (?, ?, ?)
  `;
  values = [delivery.address, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, values);
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
    decodedJwt.id,
    delivery_id,
  ];
  console.log(values);
  [results] = await conn.execute(sql, values);
  const order_id = results.insertId;

  // 3) orderedBook 테이블 튜플 추가
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

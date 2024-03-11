// module import
const express = require('express');
const dotenv = require('dotenv');

// Initial Option
dotenv.config();
const app = express();
app.listen(process.env.PORT);

// import Router
const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');

// use Router
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/category', categoryRouter);
app.use('/likes', likeRouter);
app.use('/carts', cartRouter);
app.use('/orders', orderRouter);

const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // 요청을 허용할 도메인 지정, 프론트엔드 개발 서버
  credentials: true,
};

app.use(cors(corsOptions));

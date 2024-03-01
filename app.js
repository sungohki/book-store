// module import
const express = require('express');
const dotenv = require('dotenv');

// Initial Option
dotenv.config();
const app = express();
app.listen(process.env.PORT);

// import Router
const userRouter = require('./routes/users');
app.use('/', userRouter);

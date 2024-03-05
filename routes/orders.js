const express = require('express');
const router = express.Router();
router.use(express.json());
const {
  orderCartItems,
  getOrderItems,
  getOrderItemDetail,
} = require('../controller/OrderController');

// 주문 하기 (주문 요청)
router.post('/', orderCartItems);
// 주문 목록 조회
router.get('/', getOrderItems);
// 주문 상세 상품 조회
router.get('/:id', getOrderItemDetail);

module.exports = router;

const express = require('express');
const router = express.Router();
router.use(express.json());

const {
  addToCart,
  viewCartItems,
  removeCartItem,
} = require('../controller/CartController');

// 장바구니 도서 담기
router.post('/', addToCart);
// 장바구니 도서 목록 조회
// && 장바구니 선택 도서 목록 조회 (주문 예상 도서 조회)
router.get('/', viewCartItems);
// 장바구니 도서 삭제
router.delete('/:id', removeCartItem);

module.exports = router;

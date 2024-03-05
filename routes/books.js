const express = require('express');
const { viewAll, viewDetail } = require('../controller/BookController');
const router = express.Router();
router.use(express.json());

// 전체 도서 조회
// && 카테고리별 도서 조회
router.get('/', viewAll);
// 개별 도서 조회
router.get('/:id', viewDetail);

module.exports = router;

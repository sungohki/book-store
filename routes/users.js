const express = require('express');

const router = express.Router();
router.use(express.json());

// 회원 가입
router.post('/join', (req, res) => {
  res.json();
});

// 로그인
router.post('/login', (req, res) => {
  res.json();
});

// 비밀번호 변경 요청
router.post('/reset', (req, res) => {
  res.json();
});

// 비밀번호 변경
router.put('/reset', (req, res) => {
  res.json();
});

module.exports = router;

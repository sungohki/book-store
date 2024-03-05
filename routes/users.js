const express = require('express');
const router = express.Router();
router.use(express.json());

const {
  userJoin,
  userLogin,
  userPwResetRequest,
  userPwReset,
} = require('../controller/UserController');

// 회원 가입
router.post('/join', userJoin);
// 로그인
router.post('/login', userLogin);
// 비밀번호 변경 요청
router.post('/reset', userPwResetRequest);
// 비밀번호 변경
router.put('/reset', userPwReset);

module.exports = router;

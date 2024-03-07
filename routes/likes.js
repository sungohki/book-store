const express = require('express');
const router = express.Router();
router.use(express.json());
const {
  addLike,
  deleteLike,
  toggleLike,
} = require('../controller/LikeController');

router.post('/:id', toggleLike);
// // 좋아요 추가
// router.post('/:id', addLike);
// // 좋아요 삭제
// router.delete('/:id', deleteLike);

module.exports = router;

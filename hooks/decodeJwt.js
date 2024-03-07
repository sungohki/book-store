const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');
dotenv.config();

function decodeJwt(req, res) {
  // Call jwt token from req.headers
  try {
    const receivedToken = req.headers['authorization'];
    if (!receivedToken) return null;
    const decodedToken = jwt.verify(receivedToken, process.env.PRIVATE_KEY);
    return decodedToken;
  } catch (err) {
    return errorResController(err, res);
  }
}

function errorResController(err, res) {
  if (err instanceof jwt.TokenExpiredError) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: err.name + ': 로그인 세션 만료. 다시 로그인 하세요.',
    });
  } else if (err instanceof jwt.JsonWebTokenError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: err.name + ': 잘못된 토큰 입니다.',
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: err.name + ': 잘못된 요청 입니다.',
    });
  }
  return null;
}

module.exports = { decodeJwt };

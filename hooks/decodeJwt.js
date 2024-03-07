const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function decodeJwt(req, res) {
  // Call jwt token from req.headers
  try {
    const receivedToken = req.headers['authorization'];
    const decodedToken = jwt.verify(receivedToken, process.env.PRIVATE_KEY);
    // console.log(decodedToken);
    return decodedToken;
  } catch (err) {
    return err;
  }
}

module.exports = { decodeJwt };

const { StatusCodes } = require('http-status-codes');

function readRes(res, err, results) {
  if (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
  return res.status(StatusCodes.OK).json(results);
}

module.exports = readRes;

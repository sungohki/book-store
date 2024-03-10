const { StatusCodes } = require('http-status-codes');

function updateRes(res, err, results) {
  if (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
  if (results.affectedRows) {
    return res.status(StatusCodes.OK).json(results);
  } else {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
}

module.exports = updateRes;

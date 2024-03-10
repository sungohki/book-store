const { StatusCodes } = require('http-status-codes');

function createRes(res, err, results) {
  if (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
  if (results.affectedRows) {
    return res.status(StatusCodes.CREATED).json(results);
  } else {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
}

module.exports = createRes;

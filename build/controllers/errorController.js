"use strict";

/** @format */

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    // error: err,
    message: err.message,
    stack: err.stack
  });
};
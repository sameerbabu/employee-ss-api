const status = require('http-status');
const { customAlphabet } = require('nanoid')
const { validationResult } = require('express-validator');

exports.httpStatus = status;

exports.sendResponse = (res, status, message, result, additional_obj) => {

  let data_key = (status == this.httpStatus.OK) ? "data" : "errors";
  let msg = (status == this.httpStatus.OK) ? "Ok" : "Bad request";
  let output = {
    meta: {
      status,
      message,
    },
    ...(additional_obj && additional_obj),
  }
  output[data_key] = result;
  if (message == "") {
    output["meta"]["message"] = msg;
  }
  return res.status(status).send(output);
};

exports.getUniqueId = (length) => {
  return customAlphabet('123456789abcdefghijklmnopqrstuvwxyz', length || 5)();
};


exports.validateResponse = (req, res) => {

  const errors = validationResult(req);
  let errors_array = [];
  if (!errors.isEmpty()) {
    errors.array().map((e) => { errors_array.push(e.msg) });
  }
  return errors_array;
};

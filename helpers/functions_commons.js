const cons = require("../config/web_string");

/**
 * @name: queryError
 * @description: This module is used to send the `query error` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} res.json() function. Which is used to send the encrypted response to the client side.
 */
exports.queryError = function (res, data = {}, message = '') {
  return res.json({
    code: cons.query_err_format,
    string: message ? message : cons.query_err_format_msg,
    result: data
  });
};

/**
 * @name: authError
 * @description: This module is used to send the `authentication error` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} res.json() function. Which is used to send the encrypted response to the client side.
 */
exports.authError = function (res, data = []) {
  return res.json({
    code: cons.unauthorize,
    string: cons.unauthorize_msg,
  });
};

exports.validation = function (res, code, message) {
  return res.json({
    code: code,
    string: message
  });
}

/**
 * @name: actionSuccess
 * @description: This module is used to send the `success` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} res.json() function. Which is used to send the encrypted response to the client side.
 */
exports.actionSuccess = function (res, data = [], message) {
  return res.json({
    code: cons.success,
    string: message ? message : cons.success_msg,
    result: data
  }
  );
};

/**
 * @name: alreadyError
 * @description: This module is used to send the `query error` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} res.json() fucntion. Which is used to send the encrypted response to the client side.
 */
exports.alreadyExistError = function (res, data = []) {
  return res.json({
    code: cons.already_exists_code,
    string: cons.already_exists_msg,
    //result: data
  });
};

/**
 * @name: paramMissingError
 * @description: This module is used to send the `parameter missing error` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} res.json() function. Which is used to send the encrypted response to the client side.
 */
exports.paramMissingError = function (res, data = []) {
  return res.json({
    code: cons.param_missing,
    string: cons.param_missing_msg,
  });
};


/**
 * @name: noFoundError
 * @description: This module is used to send the `query error` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} res.json() fucntion. Which is used to send the encrypted response to the client side.
 */
exports.noFoundError = function (res, data = []) {
  return res.json({
    code: cons.not_found,
    string: cons.not_found_msg,
    response: data
  });
};


/**
 * @name: credentialsError
 * @description: This module is used to send the `query error` response for any action back to the client.
 * @param {object} request
 * @param {object} data this is data that can be send to back to the client with the response.
 * @returns {object} res.json() fucntion. Which is used to send the encrypted response to the client side.
 */
 exports.credentialsError = function (res, data = []) {
  return res.json({
    code: cons.wrong_credential,
    string: cons.wrong_credential_msg
  });
};

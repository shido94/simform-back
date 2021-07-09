
const jwt = require('jsonwebtoken');
const function_c = require('../helpers/functions_commons');

module.exports.checkAuth = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_KEYS);
    req.user = decode;
    next();
  }
  catch (error) {
    return function_c.authError(res);
  }
};

module.exports.validateToken = (req,res,next) => {
  try {
    const token = req.body.token;
    const decode = jwt.verify(token, process.env.JWT_KEYS);
    req.user = decode;
    next();
  }
  catch (error) {
    return function_c.authError(res);
  }
};

module.exports.createToken =  (userId) => {
    try {
        const token = jwt.sign({
            id: userId
          }, process.env.JWT_KEYS ,
          {
            expiresIn: "5 days"
        });

        return token;
    }
    catch (error) {
        throw error;
    }
};
const jwt = require('jsonwebtoken');
const auth_config = require('../config/auth.config.js');
exports.verifyAccessToken = async (req) => {

  return new Promise(async (resolve) => {
    try {

      let access_token = req.headers['x-access-token'];
      //return false(invalid)
      if (!access_token) {
        return resolve(false);
      }

      //return false(invalid)
      jwt.verify(access_token, auth_config.secret, async (err, decoded) => {
        if (err) {
          return resolve(false);
        }
        //update the request
        req.token_data = decoded;

        //return the req
        return resolve(decoded);
      });
    } catch (e) {
      console.log(e);
      return resolve(false);
    }
  });

}


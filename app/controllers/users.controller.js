let bcrypt = require("bcryptjs");
const models = require("../models");
const Users = models.Users;
const {
  sendResponse,
  httpStatus,
  validateResponse,
} = require("../services/common.service.js");
const admin_mail = "test-admin@sameer.xyco";
const jwt = require("jsonwebtoken");
const auth_config = require("../config/auth.config.js");

//create jwt token
async function createJwt(user_data) {
  return new Promise(async (resolve, reject) => {
    try {
      let token = jwt.sign(user_data, auth_config.secret, {
        expiresIn: 86400, // 24 hours
      });
      return resolve(token);
    } catch (e) {
      console.log(e);
      return reject("Token error, Bad request");
    }
  });
}

exports.signin = async (req, res) => {
  try {
    //validate the request and stop execution if failed
    let errors_array = validateResponse(req, res);
    if (errors_array.length > 0) {
      return sendResponse(res, httpStatus.BAD_REQUEST, "", errors_array);
    }

    let username = req.body.username;
    let password = req.body.password;

    let where_obj = {};
    where_obj["username"] = username;
    let user_data = await Users.findAll({ where: where_obj, raw: true });
    let is_valid = false;
    //check if username exists
    if (user_data.length == 1 && user_data[0].user_id != undefined) {
      if (user_data[0].status == "1") {
        //valid user exists, so verify password
        if (user_data[0].password) {
          is_valid = bcrypt.compareSync(password, user_data[0].password);
        }
      } else {
        //blocked or inactive user, we might want to show a different message for these users
        return sendResponse(
          res,
          httpStatus.UNAUTHORIZED,
          `User is Inactive, Please reach us at ${admin_mail} to activate your account`,
          {}
        );
      }
    } else {
      //return error saying user not found
      return sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        "Username does not exist",
        {}
      );
    }
    if (!is_valid) {
      return sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        "Incorrect password",
        {}
      );
    }

    //valid user, generate jwt token
    let user_json = {
      username: user_data[0]["username"],
      user_id: user_data[0]["user_id"],
      role: user_data[0]["role"],
      email: user_data[0]["email"],
    };
    let jwt_data = await createJwt(user_json);

    //@TODO update last login time to the DB

    user_json["token"] = jwt_data;

    return sendResponse(res, httpStatus.OK, "Succesfully Logged in", user_json);
  } catch (e) {
    console.log(e);
    return sendResponse(res, httpStatus.BAD_REQUEST, e.message || "", {});
  }
};

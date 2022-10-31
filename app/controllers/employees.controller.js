const models = require("../models");
const Employees = models.Employees;

const {
  sendResponse,
  httpStatus,
  getUniqueId,
  validateResponse,
} = require("../services/common.service.js");

exports.create_employee = async (req, res) => {
  try {
    //validate the request and stop execution if failed
    let errors_array = validateResponse(req, res);
    if (errors_array.length > 0) {
      return sendResponse(res, httpStatus.BAD_REQUEST, "", errors_array);
    }

    let ins_array = {};
    let emp_id = getUniqueId();

    ins_array["emp_id"] = emp_id;
    ins_array["name"] = req.body.name;
    ins_array["salary"] = req.body.salary;
    ins_array["currency"] = req.body.currency; //for now not considering in calculations
    ins_array["department"] = req.body.department;
    ins_array["sub_department"] = req.body.sub_department;
    if(req.body.on_contract){
        ins_array["on_contract"] = req.body.on_contract;
    }
    
    let emp_details = await Employees.create(ins_array);

    //@TODO check for uniqueid(emp_id) collision and retry

    if (!emp_details || !emp_details["dataValues"].id) {
      return sendResponse(res, httpStatus.CONFLICT, "Please retry", {});
    }
    //Filter the response, so that user never see the actual id in the response
    emp_details["created_date_time"] = emp_details["dataValues"]["createdAt"];
    delete emp_details["dataValues"].id;
    delete emp_details["dataValues"].createdAt;
    delete emp_details["dataValues"].updatedAt;

    return sendResponse(res, httpStatus.OK, "Employee Added", emp_details);
  } catch (e) {
    console.log(e);
    return sendResponse(res, httpStatus.BAD_REQUEST, e.message || "", {});
  }
};

exports.delete_employee = async (req, res) => {
  try {
    //validate the request and stop execution if failed
    let errors_array = validateResponse(req, res);
    if (errors_array.length > 0) {
      return sendResponse(res, httpStatus.BAD_REQUEST, "", errors_array);
    }

    let where_obj = {};
    where_obj["emp_id"] = req.query.emp_id;
    let affected_rows = await Employees.destroy({ where: where_obj });
    if (affected_rows > 0) {
      return sendResponse(res, httpStatus.OK, "Employee deleted", []);
    } else {
      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        "No user with that user_id",
        {}
      );
    }
  } catch (e) {
    console.log(e);
    return sendResponse(res, httpStatus.BAD_REQUEST, e.message || "", {});
  }
};

exports.list_employees = async (req, res) => {
  try {
    //validate the request and stop execution if failed
    let errors_array = validateResponse(req, res);
    if (errors_array.length > 0) {
      return sendResponse(res, httpStatus.BAD_REQUEST, "", errors_array);
    }

    //@TODO pagination using query params

    let employees_array = await Employees.findAll({
      raw: true,
      attributes: {
        exclude: ["id", "created_date_time", "updated_date_time", "createdAt", "updatedAt"],
      },
    });
    console.log("employees_array")
    console.log(employees_array)
    //@TODO send pagination details along with response

    return sendResponse(res, httpStatus.OK, "ok", employees_array);
  } catch (e) {
    console.log(e);
    return sendResponse(res, httpStatus.BAD_REQUEST, e.message || "", {});
  }
};

exports.ss = async (req, res) => {
  try {
    //validate the request and stop execution if failed
    let errors_array = validateResponse(req, res);
    if (errors_array.length > 0) {
      return sendResponse(res, httpStatus.BAD_REQUEST, "", errors_array);
    }

    //update group by based on the query params
    let group_by = [];
    let attributes = [];

    if (req.query.group_by && req.query.group_by == "department") {
      group_by.push("department");
      attributes.push("department");
    }

    //if it is sub_depratment, have to first group by department and after that have to group by sub_department
    if (req.query.group_by && req.query.group_by == "sub_department") {
      group_by.push("department");
      attributes.push("department");

      group_by.push("sub_department");
      attributes.push("sub_department");
    }

    attributes.push([
      models.Sequelize.fn(
        "ROUND",
        models.Sequelize.fn("AVG", models.Sequelize.col("salary")),
        2
      ),
      "mean",
    ]);
    attributes.push([
      models.Sequelize.fn("MIN", models.Sequelize.col("salary")),
      "min",
    ]);
    attributes.push([
      models.Sequelize.fn("MAX", models.Sequelize.col("salary")),
      "max",
    ]);

    let where_obj = {};
    if (req.query.on_contract) {
      where_obj["on_contract"] = req.query.on_contract;
    }

    let employee_ss_array = await Employees.findAll({
      raw: true,
      where: where_obj,
      attributes: attributes,
      group: group_by,
    });

    return sendResponse(res, httpStatus.OK, "ok", employee_ss_array);
  } catch (e) {
    console.log(e);
    return sendResponse(res, httpStatus.BAD_REQUEST, e.message || "", {});
  }
};

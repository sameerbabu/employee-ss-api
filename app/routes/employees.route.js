const { verifyAccessToken } = require("../services/auth.service.js");
const { body, query } = require('express-validator');
const { create_employee, delete_employee, list_employees, ss } = require("../controllers/employees.controller.js");


module.exports = (app) => {
    let router = require("express").Router();

    router.use(async (req, res, next) => {
        let isValid = await verifyAccessToken(req);
        if (!isValid) {
            return next("router");
        }
        next();
    });

    //create employee route
    router.post("/", [
        body('name').isLength({ min: 1 }).withMessage('name is required'),
        body('salary').not().isString().withMessage('salary should be a number'),
        body('salary').isFloat().withMessage('salary should be a number'),
        body('currency').isLength({ min: 1 }).withMessage('currency is required'),
        body('department').isLength({ min: 1 }).withMessage('department is required'),
        body('sub_department').isLength({ min: 1 }).withMessage('sub_department is required'),
        body('on_contract').optional().isString().isIn(['true', 'false']).withMessage('on_contract should match one of [true, false]'),
    ],
        create_employee);

    //delete employee route
    router.delete("/", [
        query('emp_id').isLength({ min: 1 }).withMessage('emp_id is required'),
    ],
        delete_employee);

    //get employee route
    router.get("/", [],
        list_employees);

    //get employee ss route
    router.get("/ss", [
        query('group_by').optional().isString().isIn(['department', 'sub_department']).withMessage('group_by should match one of [department, sub_department]'),
        query('on_contract').optional().isString().isIn(['true', 'false']).withMessage('on_contract should match one of [true, false]'),
    ],
        ss);

    router.all('*', function (req, res) {
        res.status(404).send('Path not found. Please check the document again!!! Want help? Im just an email away');
    });


    app.use("/api/v1/employees", router, (req, res) => {
        let output = { "meta": { "status": 401, "message": "Invalid x-access-token" }, "errors": {} }
        return res.status(401).send(output);
    });
};

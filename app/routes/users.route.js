const { verifyAccessToken } = require("../services/auth.service.js");
const { body } = require('express-validator');
const { signin } = require("../controllers/users.controller.js");


module.exports = (app) => {
    let router = require("express").Router();

    //create employee route
    router.post("/signin", [
        body('username').isLength({ min: 1 }).withMessage('username is required'),
        body('password').isLength({ min: 1 }).withMessage('password is required'),

    ],
        signin);

    router.all('*', function (req, res) {
        res.status(404).send('Path not found. Please check the document again!!! Want help? Im just an email away');
    });

    app.use("/api/v1/user", router);
};

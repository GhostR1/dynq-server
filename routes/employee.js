const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const Employee = require('../models/employee');
const Establishment = require('../models/establishment')

const JWT_KEY = "MuSecretHz";

router.get('/', (req, res, next) => {
    Employee.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if(docs) {
                res.status(200).json(docs);
            } else {
                res.status(404).json({message: "No data in database!"})
            }
        })
        .catch((err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        }));
});
router.post("/", (req, res, next) => {
    Establishment.findById(req.body.estId)
        .then(establishment => {
            if (!establishment) {
                return res.status(404).json({
                    message: "Establishment not found!"
                })
            }
            const employee = new Employee({
                _id: new mongoose.Types.ObjectId(),
                estId: req.body.estId,
                Name: req.body.Name,
                Surname:req.body.Surname,
                SecondName: req.body.SecondName,
                Dept: req.body.Dept,
                EmpNum: req.body.EmpNum,
                Email: req.body.Email,
                Password: req.body.Password
            });
            employee
                .save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        newEmployee: {
                            _id: result._id,
                            estId: result.estId,
                            Name: result.Name,
                            Surname:result.Surname,
                            SecondName: result.SecondName,
                            Dept: result.Dept,
                            EmpNum: result.EmpNum,
                            Email: result.Email,
                            Password: result.Password
                        }
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})
router.get('/:idEmployee', (req, res, next) => {
    Employee.findById({"_id": req.params.idEmployee})
        .exec()
        .then(employee => {
            if (!employee) {
                return res.status(404).json({
                    message: 'Employee not found'
                });
            }
            res.status(200).json({
                _id: employee._id,
                estId: employee.estId,
                Name: employee.Name,
                Surname: employee.Surname,
                SecondName: employee.SecondName,
                Dept: employee.Dept,
                EmpNum: employee.EmpNum,
                Email: employee.Email,
                Password: employee.Password
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.patch("/:idEmployee", (req, res, next) => {
    Employee.update({ _id: req.params.idEmployee}, { $set: {
            estId: req.body.estId,
            Name: req.body.Name,
            Surname: req.body.Surname,
            SecondName: req.body.SecondName,
            DeptNum: req.body.DeptNum,
            EmpNum: req.body.EmpNum,
            Email: req.body.Email,
            Password: req.body.Password
        }})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Employee updated!",
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
router.delete("/:idEmployee", (req, res, next) => {
    Employee.remove({ _id: req.params.idEmployee})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Delete successful!',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/sign-in", (req, res, next) => {
    Employee.find({ "Email": req.body.Email})
        .exec()
        .then(user => {
            if(req.body.Password === user[0].Password) {
                const token = jwt.sign({
                        _id: user._id
                    },
                    JWT_KEY,
                    {
                        expiresIn: "1h"
                    });
                console.log("token: ", token)
                return res.status(200).json({
                    token: token
                });
            }
            res.status(401).json({
                message: "Auth failed!"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
            bcrypt.hash(req.body.Password, 10, (err, result) => {
                const employee = new Employee({
                    _id: new mongoose.Types.ObjectId(),
                    estId: req.body.estId,
                    Name: req.body.Name,
                    Surname:req.body.Surname,
                    SecondName: req.body.SecondName,
                    Dept: "Dynamic",
                    EmpNum: req.body.EmpNum,
                    Email: req.body.Email,
                    Password: result
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
                                Dept: "Dynamic",
                                EmpNum: result.EmpNum,
                                Email: result.Email,
                                Password: result.Password
                            }
                        });
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

router.get("/establishment/:idEst", (req, res, next) => {
    Employee.find({"estId": req.params.idEst})
        .exec()
        .then(employees => {
            if (!employees) {
                return res.status(404).json({
                    message: 'Employees are not found'
                });
            }
            res.status(200).json(employees)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})
router.patch("/:idEmployee", (req, res, next) => {
        Employee.update({_id: req.params.idEmployee}, {
            $set: {
                Name: req.body.Name,
                Surname: req.body.Surname,
                SecondName: req.body.SecondName,
                EmpNum: req.body.EmpNum,
                Email: req.body.Email
            }
        })
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
            if(user[0] === undefined) {
                return res.status(404).json({
                    message: "This user does not exist!"
                });
            } else {
                bcrypt.compare(req.body.Password, user[0].Password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({
                                _id: user[0]._id,
                                estId: user[0].estId
                            }, JWT_KEY);
                        console.log("token: ", token)
                        return res.status(200).json({
                            token: token
                        });
                    }
                    else {
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message
            });
        });
});

module.exports = router;
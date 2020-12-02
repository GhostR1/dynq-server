const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Appointment = require('../models/appointment');
const Employee = require('../models/employee');

const helper = require("../middleware/algorithms");

router.get('/', (req, res, next) => {
    Appointment.find()
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
    const appointment = new Appointment({
        _id: new mongoose.Types.ObjectId(),
        clientId: req.body.clientId,
        empId: req.body.empId,
        problemId: req.body.problemId,
        Date: req.body.Date,
        Place: req.body.Place,
        Duration: req.body.Duration,
        Text: req.body.Text,
        EmpNum: req.body.EmpNum
    });
    appointment
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    res.status(201).json({
        message: "Create is successful!",
    })

});
router.get('/:idAppointment', (req, res, next) => {
    Appointment.findById({"_id": req.params.idAppointment})
        .exec()
        .then(appointment => {
            if (!appointment) {
                return res.status(404).json({
                    message: 'Appointment not found'
                });
            }
            res.status(200).json({
                _id: appointment._id,
                clientId: appointment.clientId,
                empId: appointment.empId,
                problemId: appointment.problemId,
                Date: appointment.Date,
                Place: appointment.Place,
                Duration: appointment.Duration,
                Text: appointment.Text,
                EmpNum: appointment.DeptNum

            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.delete("/:idAppointment", (req, res, next) => {
    Appointment.remove({_id: req.params.idAppointment})
        .exec()
        .then(result => {
            Appointment.updateMany({empId: req.body.empId}, {$inc: {Place: -1}})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: "Delete of the appointment is successful!"
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});
router.patch("/queue/:idAppointment", (req, res, next) => {
    Appointment.update({ "_id": req.params.idAppointment}, { $set: {Place: 1 }})
        .exec()
        .then(
            res.status(200).json()
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.get('/queue/:idEmp', (req, res, next) => {
    Appointment.find({"empId": req.params.idEmp})
        .exec()
        .then(queue => {
            if (!queue) {
                return res.status(404).json({
                    message: 'Appointments are not found'
                });
            }
            res.status(200).json(queue)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})
router.patch("/:idAppointment", (req, res, next) => {
    Appointment.update({ _id: req.params.idAppointment}, { $set: {
            clientId: req.body.clientId,
            empId: req.body.empId,
            problemId: req.body.problemId,
            Date: req.body.Date,
            Place: req.body.Place,
            Duration: req.body.Duration,
            Text: req.body.Text,
            EmpNum: req.body.DeptNum
        }})
        .exec()
        .then(result => {
            return res.status(200).json({
                message: "Appointment updated!",
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/queue/dynamic", (req, res, next) => {
    const emp = helper.findEmp(req.body.problemId);
    console.log(emp.idEmp);
/*    Employee.find({ Dept: "Dynamic" })
        .exec()
        .then(employees => {
            console.log(employees)
            let min = employees[0];
            for(let i = 1; i < employees.length; i++) {
                if(employees[i].ClientCount < min.ClientCount) {
                    min = employees[i];
                }
            }
            const appointment = new Appointment({
                _id: new mongoose.Types.ObjectId(),
                clientId: req.body.clientId,
                empId: min._id,
                problemId: req.body.problemId,
                Date: null,
                Place: min.ClientCount + 1,
                Duration: req.body.Duration,
                Text: req.body.Text,
                EmpNum: min.EmpNum
            });
            appointment
                .save()
                .then(result => {
                    Employee.update({ _id: min._id}, { $set: {
                            ClientCount: min.ClientCount + 1
                        }})
                        .exec()
                })
                .catch(err => console.log(err));
            res.status(201).json({
                message: "Create is successful!",
            })
        })*/
})

module.exports = router;
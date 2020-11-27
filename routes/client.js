const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const Client = require('../models/client');

const JWT_KEY = "MuSecretHz";

router.get('/', (req, res, next) => {
    Client.find()
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
    const client = new Client({
        _id: new mongoose.Types.ObjectId(),
        Name: req.body.Name,
        Surname:req.body.Surname,
        SecondName: req.body.SecondName,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Password: req.body.Password,
        FingerId: req.body.FingerId,
        Status: req.body.Status
    });
    client
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    res.status(201).json({
        message: "Create is successful!",
    })

})
router.get('/:idClient', (req, res, next) => {
    Client.findById({"_id": req.params.idClient})
        .exec()
        .then(client => {
            if (!client) {
                return res.status(404).json({
                    message: 'Client not found'
                });
            }
            res.status(200).json({
                _id: client._id,
                Name: client.Name,
                Surname: client.Surname,
                SecondName: client.SecondName,
                Email: client.Email,
                Phone: client.Phone,
                Password: client.Password,
                FingerId: client.FingerId,
                Status: client.Status
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.patch("/:idClient", (req, res, next) => {
    Client.update({ _id: req.params.idClient}, { $set: {
            Name: req.body.Name,
            Surname: req.body.Surname,
            SecondName: req.body.SecondName,
            Email: req.body.Email,
            Phone: req.body.Phone,
            Password: req.body.Password,
            FingerId: req.body.FingerId,
            Status: req.body.Status
        }})
        .exec()
        .then(result => {
            return res.status(200).json({
                message: "Client updated!",
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
router.delete("/:idClient", (req, res, next) => {
    Client.remove({ _id: req.params.idClient})
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
    Client.find({ "Email": req.body.Email})
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
                return res.status(200).json({
                    token: token
                });
            }
            return res.status(401).json({
                message: "Auth failed!"
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
});

router.patch("/scan/:idClient", (req, res, next) => {
    Client.update({ _id: req.params.idClient}, { $set: {
            Status: req.body.Status
        }})
        .exec()
        .then(result => {
           return res.status(200).json({
                message: "Status of the client has been changed!",
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Admin = require('../models/admin');
const Establishment = require('../models/establishment')

const JWT_KEY = "MuSecretHz";

router.get('/', (req, res, next) => {
    Admin.find()
        .exec()
        .then(admins => {
            if(admins) {
                return res.status(200).json(admins);
            } else {
                return res.status(404).json({message: "The are no admins in DB!"})
            }
        })
        .catch((err => {
            return res.status(500).json({
                error: err
            });
        }));
});
router.post("/", (req, res, next) => {
    Establishment.findById(req.body.estId)
        .then(establishment => {
            if (!establishment) {
                return res.status(404).json({
                    message: "Establishment is not found!"
                })
            }
            const admin = new Admin({
                _id: new mongoose.Types.ObjectId(),
                estId: req.body.estId,
                Login: req.body.Login,
                Password: req.body.Password
            });
            admin
                .save()
                .then(result => {
                    return res.status(200).json({
                        newAdmin: {
                            _id: result._id,
                            estId: result.estId,
                            Login: result.Login,
                            Password: result.Password
                        }
                    });
                });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
})

router.get('/:idAdmin', (req, res, next) => {
    Admin.findById({"_id": req.params.idAdmin})
        .exec()
        .then(admin => {
            if (!admin) {
                return res.status(404).json({
                    message: 'Admin is not found!'
                });
            }
            return res.status(200).json({
                _id: admin._id,
                estId: admin.estId,
                Login: admin.Login,
                Password: admin.Password
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        });
});
router.patch("/:idAdmin", (req, res, next) => {
    Admin.update({ _id: req.params.idAdmin}, { $set: {
            estId: req.body.estId,
            Login: req.body.Login,
            Password: req.body.Password
        }})
        .exec()
        .then(result => {
            return res.status(200).json({
                message: "Admin is updated!",
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
});
router.delete("/:idAdmin", (req, res, next) => {
    Admin.remove({ _id: req.params.idAdmin})
        .exec()
        .then(result => {
            return res.status(200).json({
                message: 'Delete is successful!',
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
    Admin.find({ "Login": req.body.Login})
        .exec()
        .then(admin => {
            if(admin[0] === undefined) {
                return res.status(404).json({
                    message: "This user does not exist!"
                });
            } else {
                bcrypt.compare(req.body.Password, admin[0].Password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({ _id: admin[0]._id }, JWT_KEY);
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
                error: err
            });
        });
});

module.exports = router;
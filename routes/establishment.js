const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Establishment = require('../models/establishment');

router.get('/', (req, res, next) => {
    Establishment.find()
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
    const establishment = new Establishment({
        _id: new mongoose.Types.ObjectId(),
        Address: req.body.Address
    });
    establishment
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    res.status(201).json({
        message: "Creation of the establishment is successful!"
    })

})
router.get('/:idEstablishment', (req, res, next) => {
    Establishment.findById({"_id": req.params.idEstablishment})
        .exec()
        .then(establishment => {
            if (!establishment) {
                return res.status(404).json({
                    message: 'Establishment not found'
                });
            }
            res.status(200).json({
                _id: establishment._id,
                Address: establishment.Address
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.patch("/:idEstablishment", (req, res, next) => {
    Establishment.update({ _id: req.params.idEstablishment}, { $set: {
            Address: req.body.Address,
        }})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Establishment updated!",
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
router.delete("/:idEstablishment", (req, res, next) => {
    Client.remove({ _id: req.params.idEstablishment})
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

module.exports = router;
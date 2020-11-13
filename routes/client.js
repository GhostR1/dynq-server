const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Client = require('../models/client');

router.get('/', (req, res, next) => {
    Client.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if(docs) {
                res.status(200).json(docs);
            } else {
                res.status(404).json({message: "No data from DB!"})
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
        message: "POST req to /client",
        Client: client
    })

})
module.exports = router;
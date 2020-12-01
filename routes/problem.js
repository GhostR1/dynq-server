const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Problem = require('../models/problem');
const Establishment = require('../models/establishment')

router.get('/', (req, res, next) => {
    Problem.find()
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
            const problem = new Problem({
                _id: new mongoose.Types.ObjectId(),
                estId: req.body.estId,
                Text: req.body.Text,
                Duration: req.body.Duration
            });
            problem
                .save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        newProblem: {
                            _id: result._id,
                            estId: result.estId,
                            Text: req.body.Text,
                            Duration: req.body.Duration
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
router.get('/:idProblem', (req, res, next) => {
    Problem.findById({"_id": req.params.idProblem})
        .exec()
        .then(problem => {
            if (!problem) {
                return res.status(404).json({
                    message: 'Problem not found'
                });
            }
            res.status(200).json({
                _id: problem._id,
                estId: problem.estId,
                Text: problem.Text,
                Duration: problem.Duration
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.patch("/:idProblem", (req, res, next) => {
    Problem.update({ _id: req.params.idProblem}, { $set: {
            Text: req.body.Text,
            Duration: req.body.Duration
        }})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Problem updated!",
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
router.delete("/:idProblem", (req, res, next) => {
    Problem.remove({ _id: req.params.idProblem})
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

router.get('/list/:idEst', (req, res, next) => {
    Problem.find({ "estId": req.params.idEst})
        .exec()
        .then(problems => {
            if (!problems) {
                return res.status(404).json({
                    message: 'Problems are not found!'
                });
            }
            res.status(200).json(problems)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;
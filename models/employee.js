const mongoose = require('mongoose');

const Establishment = require('./establishment');

const employeeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    estId: { type: mongoose.Schema.Types.ObjectId, ref: 'Establishment', required: true },
    Name: {type: String, required: true },
    Surname: {type: String, required: true },
    SecondName: {type: String, required: true },
    DeptNum: {type: Number, required: true }
});

module.exports = mongoose.model("Employee", employeeSchema);
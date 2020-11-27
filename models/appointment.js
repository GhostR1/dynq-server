const mongoose = require('mongoose');

const Client = require('./client');
const Problem = require('./problem');
const Employee = require('./employee');

const appointmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    empId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true},
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true},
    Date: {type: Date, required: false, default: Date.now() },
    Place: { type: Number, required: true },
    Duration: { type: Number, default: 10, required: true },
    Text: { type: String, default: "-", required: true },
    EmpNum: { type: Number, required: true }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
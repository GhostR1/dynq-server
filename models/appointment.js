const mongoose = require('mongoose');

const Client = require('./client');
const Problem = require('./problem');
const Employee = require('./employee');

const appointmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    empId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true},
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true},
    Date: {type: String, required: true },
    Time: {type: String, required: true },
    Status: { type: String, required: true },
    Duration: { type: Number, required: true },
    Text: { type: String, required: true },
    DeptNum: { type: Number, required: true }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
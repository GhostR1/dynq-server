const mongoose = require('mongoose');

const Establishment = require('./establishment');

const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    estId: { type: mongoose.Schema.Types.ObjectId, ref: 'Establishment', required: true },
    Login: {type: String, required: true },
    Password: {type: String, required: true }
});

module.exports = mongoose.model("Admin", adminSchema);
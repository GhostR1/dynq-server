const mongoose = require('mongoose');

const Establishment = require('./establishment');

const problemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    estId: { type: mongoose.Schema.Types.ObjectId, ref: 'Establishment', required: true },
    Text: {type: String, required: true },
    Duration: {type: Number, default: 10, required: true }
});

module.exports = mongoose.model("Problem", problemSchema);
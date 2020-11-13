const mongoose = require('mongoose');

const establishmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectID,
    Address: {type: String, required: true}
});

module.exports = mongoose.model("Establishment", establishmentSchema);
const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectID,
    Name: {type: String, required: true},
    Surname: {type: String, required: true},
    SecondName: {type: String, required: true},
    Email: {type: String, required: true},
    PhoneId: { type: String, required: true },
    Password: { type: String, required: true },
    FingerId: { type: String, required: false},
    Status: { type: Boolean, required: true}
});

module.exports = mongoose.model("Client", clientSchema);
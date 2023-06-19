const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    // You can add more fields if necessary.
});

module.exports = mongoose.model('User', UserSchema);

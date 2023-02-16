const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin_account = new Schema({
    username: { type: String, index: true },
    password: { type: String, index: true },
});

module.exports = mongoose.model('admin_account', Admin_account)
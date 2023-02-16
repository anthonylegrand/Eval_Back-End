const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Perssonage = new Schema({
    compteID: { type: String, max: 30, index: true },
    pseudo: { type: String, max: 30 },
    niveau: { type: Number, min: 0, max: 70, default: 0 },
    classe: { type: String, enum: process.env.CLASSES_LIST.split(', ') },
});

module.exports = mongoose.model('perssonage', Perssonage)
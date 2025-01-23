const mongoose = require('mongoose');

let autorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    anyoNacimiento: {
        type: Number,
        min: 0,
        max: 2000
    }
});

let Autor = mongoose.model('autores', autorSchema);

module.exports = Autor;
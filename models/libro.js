const mongoose = require('mongoose');

// Definir esquema y modelo
let libroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título del libro es obligatorio'],
        minlength: [3, 'El título del libro debe tener al menos 3 caracteres'],
        trim: true         
    },
    editorial: {
        type: String
    },
    precio: {
        type: Number,
        required: [true, 'El precio del libro es obligatorio'],
        min: [0, 'El precio del libro no puede ser negativo'],
    },
    portada: {
        type: String
    }
});

let Libro = mongoose.model('libro', libroSchema);

module.exports = Libro;

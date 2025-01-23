const express = require('express');

let Autor = require(__dirname + '/../models/autor.js');
let router = express.Router();

// Servicio de listado
router.get('/', (req, res) => {
    Autor.find().then(resultado => {
        res.status(200)
           .send({ok: true, resultado: resultado});
    }).catch (error => {
        res.status(500)
           .send({ok: false, error: "Error obteniendo autores"});
    });
});

// Servicio de inserción
router.post('/', (req, res) => {
    let nuevoAutor = new Autor({
        nombre: req.body.nombre,
        anyoNacimiento: req.body.anyoNacimiento
    });

    nuevoAutor.save().then(resultado => {
        res.status(200)
           .send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(400)
           .send({ok: false, error: "Error añadiendo autor"});
    });
});

// Servicio de borrado
router.delete('/:id', (req,res) => {
    Autor.findByIdAndRemove(req.params['id'])
    .then(resultado => {
        if (resultado)
            res.status(200)
               .send({ok: true, resultado: resultado});
        else
            res.status(400)
               .send({ok: false, error: "Autor no encontrado"});
    }).catch(error => {
        res.status(400)
           .send({ok: false, error: "Error borrando autor"});
    });
});

module.exports = router;
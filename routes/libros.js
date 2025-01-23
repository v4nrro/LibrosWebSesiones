const express = require('express');

const upload = require(__dirname + '/../utils/uploads.js');
let Libro = require(__dirname + '/../models/libro.js');
let router = express.Router();

let autenticacion = (req, res, next) => {
    if (req.session && req.session.usuario)
        return next();
    else
        res.render('login');
};

// Listado general
router.get('/', (req, res) => {
    Libro.find().then(resultado => {
        res.render('libros_listado', { libros: resultado});
    }).catch (error => {
    }); 
});

// Formulario de nuevo libro
router.get('/nuevo', autenticacion, (req, res) => {
    res.render('libros_nuevo');
});

// Formulario de edición de libro
router.get('/editar/:id', autenticacion, (req, res) => {
    Libro.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('libros_editar', {libro: resultado});
        } else {
            res.render('error', {error: "Libro no encontrado"});
        }
    }).catch(error => {
        res.render('error', {error: "Libro no encontrado"});
    });
});

// Ficha de libro
router.get('/:id', (req, res) => {
    Libro.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('libros_ficha', { libro: resultado});
        else    
            res.render('error', {error: "Libro no encontrado"});
    }).catch (error => {
    }); 
});

// Insertar libros
router.post('/', upload.upload.single('portada'), autenticacion, (req, res) => {
    let nuevoLibro = new Libro({
        titulo: req.body.titulo,
        editorial: req.body.editorial,
        precio: req.body.precio
    });
    if (req.file)
        nuevoLibro.portada = req.file.filename;

    nuevoLibro.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        let errores = {
            general: 'Error insertando libro'
        };
        if(error.errors.titulo)
        {
            errores.titulo = error.errors.titulo.message;
        }
        if(error.errors.precio)
        {
            errores.precio = error.errors.precio.message;
        }

        res.render('libros_nuevo', {errores: errores, datos: req.body});
    });
});

// Borrar libros
router.delete('/:id', autenticacion, (req, res) => {
    Libro.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', {error: "Error borrando libro"});
    });
});

// Modificar libros
// Lo definimos como "POST" para integrarlo mejor en un formulario multipart
router.post('/:id', upload.upload.single('portada'), autenticacion, (req, res) => {
    // Buscamos el libro y cambiamos sus datos
    Libro.findById(req.params.id).then(resultado => {
        if (resultado)
        {
            resultado.titulo = req.body.titulo;
            resultado.editorial = req.body.editorial;
            resultado.precio = req.body.precio;
            // Si viene una portada, la cambiamos
            if(req.file)
                resultado.portada = req.file.filename;
            resultado.save().then(resultado2 => {
                res.redirect(req.baseUrl);
            }).catch(error2 => {
                let errores = {
                    general: 'Error editando libro'
                };
                if(error2.errors.titulo)
                {
                    errores.titulo = error2.errors.titulo.message;
                }
                if(error2.errors.precio)
                {
                    errores.precio = error2.errors.precio.message;
                }
        
                res.render('libros_editar', {errores: errores, 
                    libro: { id: req.params.id, titulo: req.body.titulo, 
                        editorial: req.body.editorial, precio: req.body.precio}});
                });        
        }
        else    
            res.render('error', {error: "Libro no encontrado"});
    }).catch (error => {
        res.render('error', {error: "Error editando libro"});
    }); 
});

module.exports = router;
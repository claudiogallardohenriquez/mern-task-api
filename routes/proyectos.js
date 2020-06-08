const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/ProyectoController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

//Crea un usuario api/proyectos
router.post(
    '/',
    auth,
    [check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()],
    proyectoController.crearProyecto
);

//Obtener los proyectos
router.get('/', auth, proyectoController.obtenerProyectos);

//Actualizar proyecto
router.put(
    '/:id',
    auth,
    [check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()],
    proyectoController.actualizarProyecto
);

//Eliminar un proyecto
router.delete('/:id', auth, proyectoController.eliminarProyecto);

module.exports = router;

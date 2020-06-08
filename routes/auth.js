//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth');
const authController = require('../controllers/AuthController');

//Iniciar sesión api/auth
router.post('/', authController.autenticarUsuario);

// Obtiene el usuario autenticado
router.get('/', auth, authController.obtenerUsuarioAutenticado);

module.exports = router;

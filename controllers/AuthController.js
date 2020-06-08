const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //extraer el email y password
    const { email, password } = req.body;

    try {
        //revisar que se un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        //Revisar su password
        const passCorrecto = await bcrypt.compare(password, usuario.password);

        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Password Incorrecto' });
        }

        //Si todo es correcto, crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id,
            },
        };

        //firmar el JWT, expira en 1 hora
        jwt.sign(
            payload,
            process.env.SECRETA,
            {
                expiresIn: 3600,
            },
            (error, token) => {
                //se revisa si hay un error al crear el token
                if (error) throw error;

                //Mensaje de confirmación
                res.json({ token });
            }
        );
    } catch (error) {
        console.error(error);
    }
};

// Obtener que usuario autenticado
exports.obtenerUsuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select(
            '-password'
        );
        res.json({ usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

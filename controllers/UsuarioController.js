const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //Extraer email y password
    const { email, password } = req.body;

    try {
        // revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({
            email,
        });

        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // crea el nuevo usuario
        usuario = new Usuario(req.body);

        // hashear el password
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        // guarda el usuario
        await usuario.save();

        // crear y firmar el JWT
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
        res.status(400).send('Hubo un error');
    }
};

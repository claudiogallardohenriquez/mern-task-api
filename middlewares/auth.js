const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //Leer el token del header
    const token = req.header('x-auth-token');

    //Revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso no válido' });
    }

    //validar el token
    try {
        //verificamos el token con la palabra secreta
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next(); // Se va al siguiente middleware
    } catch (error) {
        res.status(400).json({ msg: 'Token no válido' });
    }
};

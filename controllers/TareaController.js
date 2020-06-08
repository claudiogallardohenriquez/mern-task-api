const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

//Obtienes las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //Obtener las tareas por proyecto y las ordena
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;

        //Revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            res.status(404).json({ mgs: 'No existe esa tarea' });
        }

        //Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //Crear un objeto con la nueva informacion
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate(
            { _id: req.params.id },
            nuevaTarea,
            { new: true }
        );

        res.json({ tarea });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        //Revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            res.status(404).json({ mgs: 'No existe esa tarea' });
        }

        //Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //eliminar
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea eliminada' });

        res.json({ tarea });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

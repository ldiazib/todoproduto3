const Task = require('../models/task');

// Crear una nueva tarea
exports.createTask = async (req, res) => {
  try {
    const { titulo, descripcion, estado, fecha, responsable, panelId } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null; // Ruta del archivo subido

    const task = new Task({
      titulo,
      descripcion,
      estado,
      fecha,
      responsable,
      panelId,
      filePath
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

// Obtener todas las tareas
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

// Actualizar una tarea
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, fecha, responsable } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedFields = {
      titulo,
      descripcion,
      estado,
      fecha,
      responsable,
    };

    if (filePath) {
      updatedFields.filePath = filePath;
    }

    const task = await Task.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};

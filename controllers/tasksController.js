const Task = require('../models/task');

// Crear una nueva tarea
exports.createTask = async (req, res) => {
  try {
    const { titulo, descripcion, estado, fecha, responsable, panelId } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null; 

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

req.io.emit('newTask', task);

    res.status(201).json(task);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

// Obtener todas las tareas
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(req.params.panelId ? { panelId: req.params.panelId } : {});
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

    req.io.emit('updateTask', task);

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
    req.io.emit('deleteTask', id);
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};

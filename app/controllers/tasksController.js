const Task = require('../models/task');

const createTask = async (titulo, descripcion, fecha, hora, responsable, filePath) => {
  try {
    const task = new Task({ titulo, descripcion, fecha, hora, responsable, filePath });
    return await task.save();
  } catch (error) {
    console.error('Error creando tarea:', error);
    throw new Error('Error creando tarea');
  }
};

const updateTask = async (id, updates) => {
  try {
    return await Task.findByIdAndUpdate(id, updates, { new: true });
  } catch (error) {
    console.error('Error actualizando tarea:', error);
    throw new Error('Error actualizando tarea');
  }
};

const deleteTask = async (id) => {
  try {
    await Task.findByIdAndDelete(id);
    return `Tarea con id ${id} eliminada`;
  } catch (error) {
    console.error('Error eliminando tarea:', error);
    throw new Error('Error eliminando tarea');
  }
};

module.exports = { createTask, updateTask, deleteTask };

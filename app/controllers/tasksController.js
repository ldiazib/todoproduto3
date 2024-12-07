const Task = require('../models/task'); // Importa el modelo Task

// Función para crear una nueva tarea
const createTask = async (titulo, descripcion, fecha, hora, responsable, estado = 'to-do') => {
  try {
    const task = new Task({
      titulo,
      descripcion,
      fecha: new Date(fecha), // 👈 Asegúrate de que la fecha esté bien
      hora,
      responsable,
      estado, // 👈 Estado ahora se establece dinámicamente
    });
    return await task.save();
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    throw new Error('Error al crear la tarea');
  }
};


// Función para obtener todas las tareas
const getTasks = async () => {
  try {
    return await Task.find();  // Devuelve todas las tareas desde la base de datos
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    throw new Error('Error al obtener las tareas');
  }
};

// Función para obtener una tarea específica por su ID
const getTaskById = async (id) => {
  try {
    return await Task.findById(id);  // Busca la tarea por su ID y la devuelve
  } catch (error) {
    console.error('Error al obtener la tarea por ID:', error);
    throw new Error('Error al obtener la tarea por ID');
  }
};

module.exports = { createTask, getTasks, getTaskById };

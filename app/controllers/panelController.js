const Panel = require('../models/panel'); // Importa el modelo Panel

// Función para crear un nuevo panel
const createPanel = async (titulo, descripcion, usuario) => {
  try {
    const panel = new Panel({
      titulo,
      descripcion,
      usuario,
    });
    return await panel.save();  // Guarda el panel en la base de datos y lo devuelve
  } catch (error) {
    console.error('Error al crear el panel:', error);
    throw new Error('Error al crear el panel');
  }
};

// Función para obtener todos los paneles
const getPanels = async () => {
  try {
    return await Panel.find();  // Devuelve todos los paneles desde la base de datos
  } catch (error) {
    console.error('Error al obtener los paneles:', error);
    throw new Error('Error al obtener los paneles');
  }
};

// Función para obtener un panel específico por su ID
const getPanelById = async (id) => {
  try {
    return await Panel.findById(id);  // Busca el panel por su ID y lo devuelve
  } catch (error) {
    console.error('Error al obtener el panel por ID:', error);
    throw new Error('Error al obtener el panel por ID');
  }
};

module.exports = { createPanel, getPanels, getPanelById };

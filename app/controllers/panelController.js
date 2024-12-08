const Panel = require('../models/panel');

const createPanel = async (titulo, descripcion, usuario) => {
  try {
    const panel = new Panel({ titulo, descripcion, usuario });
    return await panel.save();
  } catch (error) {
    console.error('Error creando panel:', error);
    throw new Error('Error creando panel');
  }
};

const updatePanel = async (id, updates) => {
  try {
    return await Panel.findByIdAndUpdate(id, updates, { new: true });
  } catch (error) {
    console.error('Error actualizando panel:', error);
    throw new Error('Error actualizando panel');
  }
};

const deletePanel = async (id) => {
  try {
    await Panel.findByIdAndDelete(id);
    return `Panel con id ${id} eliminado`;
  } catch (error) {
    console.error('Error eliminando panel:', error);
    throw new Error('Error eliminando panel');
  }
};

module.exports = { createPanel, updatePanel, deletePanel };

const Panel = require('../models/panel');

// Crear un nuevo panel
exports.createPanel = async (req, res) => {
  try {
    const { titulo, descripcion, usuario } = req.body;
    const panel = new Panel({ titulo, descripcion, usuario });
    await panel.save();
    res.status(201).json(panel);
  } catch (error) {
    console.error('Error al crear el panel:', error);
    res.status(500).json({ error: 'Error al crear el panel' });
  }
};

// Obtener todos los paneles
exports.getPanels = async (req, res) => {
  try {
    const panels = await Panel.find();
    res.json(panels);
  } catch (error) {
    console.error('Error al obtener los paneles:', error);
    res.status(500).json({ error: 'Error al obtener los paneles' });
  }
};

// Actualizar un panel
exports.updatePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    const panel = await Panel.findByIdAndUpdate(id, { titulo, descripcion }, { new: true });
    if (!panel) {
      return res.status(404).json({ error: 'Panel no encontrado' });
    }
    res.json(panel);
  } catch (error) {
    console.error('Error al actualizar el panel:', error);
    res.status(500).json({ error: 'Error al actualizar el panel' });
  }
};

// Eliminar un panel
exports.deletePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const panel = await Panel.findByIdAndDelete(id);
    if (!panel) {
      return res.status(404).json({ error: 'Panel no encontrado' });
    }
    res.json({ message: 'Panel eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el panel:', error);
    res.status(500).json({ error: 'Error al eliminar el panel' });
  }
};

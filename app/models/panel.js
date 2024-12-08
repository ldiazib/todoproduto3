const mongoose = require('mongoose');

const PanelSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  usuario: { type: String, required: true }
});

module.exports = mongoose.model('Panel', PanelSchema);

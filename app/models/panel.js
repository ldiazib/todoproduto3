const mongoose = require('mongoose');

const PanelSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  usuario: { type: String, required: true },
  creadoEn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Panel', PanelSchema);

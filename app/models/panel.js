const mongoose = require('mongoose');

const PanelSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  usuario: {
    type: String,
    required: true
  },
});

const Panel = mongoose.model('Panel', PanelSchema);
module.exports = Panel;

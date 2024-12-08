const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  estado: { type: String, enum: ['pendiente', 'en progreso', 'completado'], default: 'pendiente' },
  fecha: { type: Date },
  responsable: { type: String },
  panelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Panel', required: true },
  filePath: { type: String }, 
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);

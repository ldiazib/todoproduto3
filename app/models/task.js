const TaskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  responsable: { type: String, required: true },
  estado: { type: String, default: 'to-do' },
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;

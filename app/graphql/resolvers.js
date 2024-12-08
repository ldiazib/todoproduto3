const { createPanel, updatePanel, deletePanel } = require('./controllers/panelController');
const { createTask, updateTask, deleteTask } = require('./controllers/tasksController');

const resolvers = {
  Query: {
    panels: async () => await getPanels(),
    panel: async (_, { id }) => await getPanelById(id),
    tasks: async () => await getTasks(),
    task: async (_, { id }) => await getTaskById(id),
  },
  Mutation: {
    createPanel: async (_, { panel }) => await createPanel(panel.titulo, panel.descripcion, panel.usuario),
    updatePanel: async (_, { id, panel }) => await updatePanel(id, panel),
    deletePanel: async (_, { id }) => await deletePanel(id),
    createTask: async (_, { task }) => await createTask(task.titulo, task.descripcion, task.fecha, task.hora, task.responsable, task.filePath),
    updateTask: async (_, { id, task }) => await updateTask(id, task),
    deleteTask: async (_, { id }) => await deleteTask(id),
  }
};

module.exports = resolvers;

const { createPanel, getPanels, getPanelById } = require('../controllers/panelController'); // Importa las funciones del controlador
const { createTask, getTasks, getTaskById } = require('../controllers/tasksController'); // Importa el controlador de tareas

const resolvers = {
  Query: {
    // Resolvers para las consultas de paneles
    panels: async () => {
      try {
        return await getPanels(); // Llama a la función para obtener todos los paneles
      } catch (error) {
        console.error('Error al obtener paneles:', error);
        throw new Error('Error al obtener paneles');
      }
    },

    // Resolver para obtener un solo panel por ID
    panel: async (_, { id }) => {
      try {
        return await getPanelById(id);  // Llama a la función para obtener el panel por ID
      } catch (error) {
        console.error('Error al obtener panel:', error);
        throw new Error('Error al obtener panel');
      }
    },

    // Resolvers para las consultas de tareas
    tasks: async () => {
      try {
        return await getTasks();  // Llama a la función para obtener todas las tareas
      } catch (error) {
        console.error('Error al obtener tareas:', error);
        throw new Error('Error al obtener tareas');
      }
    },

    // Resolver para obtener una tarea específica por ID
    task: async (_, { id }) => {
      try {
        return await getTaskById(id);  // Llama a la función para obtener la tarea por ID
      } catch (error) {
        console.error('Error al obtener tarea:', error);
        throw new Error('Error al obtener tarea');
      }
    },
  },

  Mutation: {
    createPanel: async (_, { titulo, descripcion, usuario }) => {
      try {
        const newPanel = await createPanel(titulo, descripcion, usuario);
        if (!newPanel) throw new Error('No se pudo crear el panel');
        return newPanel;
      } catch (error) {
        console.error('Error al crear panel:', error);
        throw new Error('Error al crear panel');
      }
    },

    // Resolver para crear una tarea
    createTask: async (_, { titulo, descripcion, fecha, hora, responsable, estado }) => {
      try {
        const newTask = await createTask(titulo, descripcion, fecha, hora, responsable, estado);
        return newTask;
      } catch (error) {
        console.error('Error al crear tarea:', error);
        throw new Error('Error al crear tarea');
      }
    }    
  }
};

module.exports = resolvers;

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    panels: [Panel!]
    panel(id: ID!): Panel
    tasks: [Task!]
    task(id: ID!): Task
  }

  input PanelInput {
    titulo: String!
    descripcion: String!
    usuario: String!
  }

  input TaskInput {
    titulo: String!
    descripcion: String!
    fecha: String!
    hora: String!
    responsable: String!
    filePath: String
  }

  type Mutation {
    createPanel(panel: PanelInput!): Panel!
    updatePanel(id: ID!, panel: PanelInput): Panel!
    deletePanel(id: ID!): String

    createTask(task: TaskInput!): Task!
    updateTask(id: ID!, task: TaskInput): Task!
    deleteTask(id: ID!): String
  }
`;

module.exports = typeDefs;

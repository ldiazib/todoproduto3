const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    panels: [Panel!]
    panel(id: ID!): Panel
    tasks: [Task!]
    task(id: ID!): Task
  }

  type Panel {
    id: ID!
    titulo: String!
    descripcion: String!
    usuario: String!
  }

  type Task {
    id: ID!
    titulo: String!
    descripcion: String!
    fecha: String!
    hora: String!
    responsable: String!
    estado: String!
  }

  type Mutation {
  createPanel(titulo: String!, descripcion: String!, usuario: String!): Panel!
  createTask(titulo: String!, descripcion: String!, fecha: String!, hora: String!, responsable: String!): Task!
}  }
`;

module.exports = typeDefs;

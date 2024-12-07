const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/database');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start(); // Asegúrate de que Apollo Server esté listo
  server.applyMiddleware({ app, path: '/graphql' });

  connectDB(); // Conectar a la base de datos (asegúrate de que está bien configurado)

  app.listen(4000, () => {
    console.log('🚀 Servidor corriendo en http://localhost:4000/graphql');
  });
}

startServer();

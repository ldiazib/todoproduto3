require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema'); // Asegúrate de que la ruta sea correcta

const app = express();

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 4000;

// Conexión a MongoDB Atlas
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((error) => console.error('Error conectando a MongoDB Atlas:', error));

// Middleware
app.use(express.json());

// Middleware de GraphQL
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true // Activar interfaz GraphiQL
}));

// Ruta inicial
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente. Visita /graphql para acceder a GraphiQL');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/graphql`);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema'); 
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

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
  graphiql: true 
}));

// Ruta inicial
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente. Visita /graphql para acceder a GraphiQL');
});

io.on('connection', (socket) => {
  console.log('Usuario conectado', socket.id);
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/graphql`);
});

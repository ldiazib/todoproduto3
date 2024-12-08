require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Asegurarse de que multer esté importado
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const path = require('path');
const schema = require(path.resolve(__dirname, './graphql/schema.js')); 

// **Definir la app de Express ANTES de usarla**
const app = express(); 
const PORT = process.env.PORT || 4000;

// Configuración de multer para la subida de archivos
const upload = multer({ dest: 'uploads/' });

// Rutas de subida de archivos (se asegura que 'app' ya esté inicializado)
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No se ha subido ningún archivo.' });
  }
  res.send({ filePath: `/uploads/${req.file.filename}` });
});

// Configuración de CORS para aceptar solicitudes POST
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

// Conectar con MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Configurar el servidor GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

// Ruta para manejar errores 404
app.use('*', (req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://127.0.0.1:${PORT}/graphql`);
});

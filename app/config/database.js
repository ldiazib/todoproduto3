// config/database.js

const mongoose = require('mongoose');
const config = require('./config'); // Asumiendo que tienes una configuración

// Reemplaza 'your_mongo_uri' con tu cadena de conexión real de MongoDB Atlas
const mongoURI = process.env.MONGO_URI; 

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conexión a MongoDB establecida");
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error);
    process.exit(1); // Termina el proceso si no se puede conectar
  }
};

module.exports = connectDB;

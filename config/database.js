
const mongoose = require('mongoose');
const config = require('./config'); 

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
    process.exit(1); 
  }
};

module.exports = connectDB;

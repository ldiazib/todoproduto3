const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasksController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Rutas
router.post('/', upload.single('file'), taskController.createTask);
router.put('/:id', upload.single('file'), taskController.updateTask);

module.exports = router;

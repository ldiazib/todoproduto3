const express = require('express');
const router = express.Router();
const panelController = require('../controllers/panelController');

router.post('/', panelController.createPanel);
router.get('/', panelController.getPanels);
router.put('/:id', panelController.updatePanel);
router.delete('/:id', panelController.deletePanel);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// create, find update, delete
router.get('/', userController.view);
// weather router
router.get('/weather',userController.weather);
router.post('/', userController.find);
router.get('/addequip', userController.form);
router.post('/addequip', userController.create);
router.get('/editequip/:id', userController.edit);
router.post('/editequip/:id', userController.update);
router.get('/viewequip/:id', userController.viewall);
router.get('/:id', userController.delete);
module.exports = router;

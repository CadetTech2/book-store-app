const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

// All task routes map to tasksController
router
  .route('/')
  .get(tasksController.getAllTasks)
  .post(tasksController.createTask);

router
  .route('/:id')
  .get(tasksController.getTaskById)
  .put(tasksController.updateTask)
  .delete(tasksController.deleteTask);

module.exports = router;

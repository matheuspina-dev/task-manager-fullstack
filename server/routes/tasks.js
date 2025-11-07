const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/auth');

const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

router
  .route('/')
  .get(ensureAuthenticated, getAllTasks)
  .post(ensureAuthenticated, createTask);
router
  .route('/:id')
  .get(ensureAuthenticated, getTask)
  .patch(ensureAuthenticated, updateTask)
  .delete(ensureAuthenticated, deleteTask);

module.exports = router;

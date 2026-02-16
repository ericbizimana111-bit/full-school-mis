const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getMyTasks,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', getTaskStats);
router.get('/my-tasks', getMyTasks);

router
  .route('/')
  .get(getTasks)
  .post(createTask);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.post('/:id/comments', addComment);

module.exports = router;
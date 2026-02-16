const express = require('express');
const {
  createExam,
  getExams,
  updateExam,
  publishResults
} = require('../controllers/examController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getExams)
  .post(authorize('admin'), createExam);

router
  .route('/:id')
  .put(authorize('admin'), updateExam);

router.put('/:id/publish', authorize('admin'), publishResults);

module.exports = router;
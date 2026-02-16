const express = require('express');
const {
  addGrade,
  updateGrade,
  getGradesByExam,
  getReportCard
} = require('../controllers/gradeController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/', authorize('teacher', 'admin'), addGrade);
router.put('/:id', authorize('teacher', 'admin'), updateGrade);
router.get('/exam/:examId', getGradesByExam);
router.get('/report/:studentId/:examId', getReportCard);

module.exports = router;
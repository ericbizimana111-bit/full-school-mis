
const express = require('express');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentAttendance,
  getStudentGrades
} = require('../controllers/studentController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getStudents)
  .post(authorize('admin'), createStudent);

router
  .route('/:id')
  .get(getStudent)
  .put(authorize('admin'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

router.get('/:id/attendance', getStudentAttendance);
router.get('/:id/grades', getStudentGrades);

module.exports = router;
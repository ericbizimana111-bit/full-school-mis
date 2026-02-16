const express = require('express');
const {
  markAttendance,
  getAttendanceByClass,
  getAttendanceReport
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/', authorize('teacher', 'admin'), markAttendance);
router.get('/class/:classId', getAttendanceByClass);
router.get('/report', authorize('admin', 'teacher'), getAttendanceReport);

module.exports = router;

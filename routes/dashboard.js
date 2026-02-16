const express = require('express');
const {
  getAdminDashboard,
  getTeacherDashboard,
  getStudentDashboard
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/teacher', authorize('teacher'), getTeacherDashboard);
router.get('/student', authorize('student'), getStudentDashboard);

module.exports = router;
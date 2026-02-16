const express = require('express');
const {
  createFee,
  recordPayment,
  getFee,
  getFeeReport
} = require('../controllers/feeController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/', authorize('admin'), createFee);
router.post('/payment', authorize('accountant', 'admin'), recordPayment);
router.get('/report', authorize('admin', 'accountant'), getFeeReport);
router.get('/:id', getFee);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getRecords, deleteRecord } = require('../controllers/recordController');

// All routes require authentication
router.use(protect);

router.get('/', getRecords);
router.delete('/:id', deleteRecord);

module.exports = router;

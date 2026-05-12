const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { predictCost } = require('../controllers/analyzeController');

// All routes require authentication
router.use(protect);

// This is now a JSON endpoint, no file upload needed
router.post('/', predictCost);

module.exports = router;

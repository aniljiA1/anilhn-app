const express = require('express');
const router = express.Router();
const { getAllStories, getStoryById, toggleBookmark } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllStories);
router.get('/:id', getStoryById);
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;

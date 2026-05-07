const Story = require('../models/Story');
const User = require('../models/User');

const getAllStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Story.countDocuments();
    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      stories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories.' });
  }
};

const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found.' });
    }
    res.json({ story });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching story.' });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user._id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found.' });
    }

    const user = await User.findById(userId);
    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== storyId);
    } else {
      user.bookmarks.push(storyId);
    }

    await user.save();

    res.json({
      message: isBookmarked ? 'Bookmark removed' : 'Bookmark added',
      bookmarked: !isBookmarked,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling bookmark.' });
  }
};

module.exports = { getAllStories, getStoryById, toggleBookmark };

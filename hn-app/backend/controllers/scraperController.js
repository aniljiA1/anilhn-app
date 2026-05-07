const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const scrapeHackerNews = async () => {
  try {
    const { data } = await axios.get('https://news.ycombinator.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HNScraper/1.0)',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const stories = [];

    const titleRows = $('.athing').slice(0, 10);

    titleRows.each((i, el) => {
      const titleRow = $(el);
      const subRow = titleRow.next('tr');

      const hnId = titleRow.attr('id');
      const titleEl = titleRow.find('.titleline > a').first();
      const title = titleEl.text().trim();
      const url = titleEl.attr('href') || '';

      const pointsText = subRow.find('.score').text().trim();
      const points = parseInt(pointsText) || 0;

      const author = subRow.find('.hnuser').text().trim() || 'unknown';
      const postedAt = subRow.find('.age').attr('title') || subRow.find('.age').text().trim() || '';

      if (title) {
        stories.push({ title, url, points, author, postedAt, hnId });
      }
    });

    const results = [];
    for (const story of stories) {
      const updated = await Story.findOneAndUpdate(
        { hnId: story.hnId },
        story,
        { upsert: true, new: true, runValidators: true }
      );
      results.push(updated);
    }

    return results;
  } catch (error) {
    console.error('Scraping error:', error.message);
    throw new Error('Failed to scrape Hacker News: ' + error.message);
  }
};

const triggerScrape = async (req, res) => {
  try {
    const stories = await scrapeHackerNews();
    res.json({
      message: `Successfully scraped ${stories.length} stories`,
      count: stories.length,
      stories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { scrapeHackerNews, triggerScrape };

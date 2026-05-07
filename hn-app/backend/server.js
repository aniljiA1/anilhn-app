const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { scrapeHackerNews } = require("./controllers/scraperController");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stories", require("./routes/storyRoutes"));
app.use("/api/scrape", require("./routes/scraperRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "HN Scraper API is running" });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5004;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    // Auto-run scraper on server start
    console.log("🔄 Running initial scrape...");
    await scrapeHackerNews();
    console.log("✅ Initial scrape complete");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

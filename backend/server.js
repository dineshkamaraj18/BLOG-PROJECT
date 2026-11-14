const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authorRoutes = require('./routes/authorRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/authors', authorRoutes);

// Root health check endpoint
app.get(['/', '/api', '/api/health'], (req, res) => {
  res.send('BLOG PROJECT API IS RUNNING');
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/technology_blog';
const LOCAL_URI = 'mongodb://127.0.0.1:27017/technology_blog';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MONGODB CONNECTED SUCCESSFULLY');
  } catch (error) {
    console.warn('PRIMARY MONGODB CONNECTION FAILED:', error.message);
    if (MONGO_URI !== LOCAL_URI) {
      console.log('Attempting fallback to local MongoDB:', LOCAL_URI);
      try {
        await mongoose.connect(LOCAL_URI);
        console.log('LOCAL MONGODB CONNECTED SUCCESSFULLY (FALLBACK)');
      } catch (err) {
        console.error('MONGODB CONNECTION ERROR:', err.message);
      }
    }
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

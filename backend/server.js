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
app.get('/', (req, res) => {
  res.send('BLOG PROJECT API IS RUNNING');
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/technology_blog';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MONGODB CONNECTED SUCCESSFULLY');
  })
  .catch((error) => {
    console.error('MONGODB CONNECTION ERROR:', error);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

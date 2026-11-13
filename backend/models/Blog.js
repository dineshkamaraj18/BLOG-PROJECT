const mongoose = require('mongoose');
require('./Author');

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Software Development',
        'Artificial Intelligence & Machine Learning',
        'Web and Mobile App Development',
        'Technology & Innovation',
        'Cybersecurity',
        'Cloud Computing',
        'Industry Insights',
      ],
      default: 'Software Development',
    },
    image: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: 'Admin',
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      default: null,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);

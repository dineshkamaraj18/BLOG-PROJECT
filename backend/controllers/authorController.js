const mongoose = require('mongoose');
const Author = require('../models/Author');

// Get all authors
exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: authors.length, authors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch authors.', error: error.message });
  }
};

// Get single author by ID
exports.getAuthorById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Invalid author ID format.' });
    }
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found.' });
    }
    res.status(200).json({ success: true, author });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch author.', error: error.message });
  }
};

// Create author (Admin protected)
exports.createAuthor = async (req, res) => {
  try {
    const { name, role, bio, avatar, twitter, linkedin, github, website } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Author name is required.' });
    }

    const author = await Author.create({
      name: name.trim(),
      role: role?.trim() || 'Tech Writer',
      bio: bio?.trim() || '',
      avatar: avatar?.trim() || '',
      twitter: twitter?.trim() || '',
      linkedin: linkedin?.trim() || '',
      github: github?.trim() || '',
      website: website?.trim() || '',
    });

    res.status(201).json({ success: true, message: 'Author created successfully.', author });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create author.', error: error.message });
  }
};

// Update author (Admin protected)
exports.updateAuthor = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Invalid author ID format.' });
    }
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found.' });
    }

    const fields = ['name', 'role', 'bio', 'avatar', 'twitter', 'linkedin', 'github', 'website'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        author[field] = req.body[field];
      }
    });

    const updated = await author.save();
    res.status(200).json({ success: true, message: 'Author updated successfully.', author: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update author.', error: error.message });
  }
};

// Delete author (Admin protected)
exports.deleteAuthor = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Invalid author ID format.' });
    }
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found.' });
    }
    await Author.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Author deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete author.', error: error.message });
  }
};

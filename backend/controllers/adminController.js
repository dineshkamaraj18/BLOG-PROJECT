const Admin = require('../models/Admin');
const Blog = require('../models/Blog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.getSetupStatus = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    res.status(200).json({
      success: true,
      isSetupRequired: adminCount === 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error checking setup status.' });
  }
};
exports.setupInitialAdmin = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: 'Admin account has already been initialized. Please log in.',
      });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'admin',
    });

    const secret = process.env.JWT_SECRET || 'quickblog_jwt_secret_key_2026';
    const token = jwt.sign(
      { id: newAdmin._id, username: newAdmin.username, email: newAdmin.email, role: newAdmin.role },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      token,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create initial admin account.',
      error: error.message,
    });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username/email and password.' });
    }
    const admin = await Admin.findOne({
      $or: [
        { username: username.trim() },
        { email: username.trim().toLowerCase() }
      ]
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const secret = process.env.JWT_SECRET || 'quickblog_jwt_secret_key_2026';
    const token = jwt.sign(
      { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
      secret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const blogsWithComments = await Blog.find({}, 'comments category');
    let totalComments = 0;
    const categoryCounts = {
      'Software Development': 0,
      'Artificial Intelligence & Machine Learning': 0,
      'Web and Mobile App Development': 0,
      'Technology & Innovation': 0,
      'Cybersecurity': 0,
      'Cloud Computing': 0,
      'Industry Insights': 0
    };

    blogsWithComments.forEach((blog) => {
      if (blog.comments) {
        totalComments += blog.comments.length;
      }
      if (categoryCounts[blog.category] !== undefined) {
        categoryCounts[blog.category] += 1;
      } else {
        categoryCounts[blog.category] = 1;
      }
    });

    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category createdAt comments');

    res.status(200).json({
      success: true,
      stats: {
        totalBlogs,
        totalComments,
        categoryCounts,
        recentBlogs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve stats.', error: error.message });
  }
};

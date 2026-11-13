const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const Author = require('../models/Author');

exports.getBlogs = async (req, res) => {
  try {
    const { category, search, page, limit } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { content: searchRegex }
      ];
    }

    const totalBlogs = await Blog.countDocuments(query);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10) || 0;

    let queryChain = Blog.find(query).populate('authorId').sort({ createdAt: -1 });

    if (limitNum > 0) {
      queryChain = queryChain.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const blogs = await queryChain;
    const totalPages = limitNum > 0 ? Math.ceil(totalBlogs / limitNum) : 1;

    res.status(200).json({
      success: true,
      count: blogs.length,
      total: totalBlogs,
      page: pageNum,
      totalPages: Math.max(1, totalPages),
      hasPrevPage: pageNum > 1,
      hasNextPage: limitNum > 0 ? pageNum < totalPages : false,
      blogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blogs.', error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Invalid blog ID format.' });
    }

    const blog = await Blog.findById(req.params.id).populate('authorId');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    // Find previous and next blog articles for navigation
    const prevBlog = await Blog.findOne({ createdAt: { $lt: blog.createdAt } })
      .sort({ createdAt: -1 })
      .select('_id title category image createdAt');

    const nextBlog = await Blog.findOne({ createdAt: { $gt: blog.createdAt } })
      .sort({ createdAt: 1 })
      .select('_id title category image createdAt');

    res.status(200).json({
      success: true,
      blog,
      prevBlog: prevBlog || null,
      nextBlog: nextBlog || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog post.', error: error.message });
  }
};
exports.createBlog = async (req, res) => {
  try {
    const { title, description, content, category, image, author, authorId } = req.body;

    if (!title || !description || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, content, and category.'
      });
    }

    const safeAuthorId = authorId && mongoose.Types.ObjectId.isValid(authorId) ? authorId : null;

    const newBlog = new Blog({
      title,
      description,
      content,
      category,
      image: image || '',
      author: author || req.admin?.username || 'Admin',
      authorId: safeAuthorId,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json({ success: true, message: 'Blog created successfully.', blog: savedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create blog.', error: error.message });
  }
};
exports.updateBlog = async (req, res) => {
  try {
    const { title, description, content, category, image, author, authorId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Invalid blog ID format.' });
    }

    const blog = await Blog.findById(req.params.id).populate('authorId');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    if (title !== undefined) blog.title = title;
    if (description !== undefined) blog.description = description;
    if (content !== undefined) blog.content = content;
    if (category !== undefined) blog.category = category;
    if (image !== undefined) blog.image = image;
    if (author !== undefined) blog.author = author;
    if (authorId !== undefined) {
      blog.authorId = (authorId && mongoose.Types.ObjectId.isValid(authorId)) ? authorId : null;
    }

    const updatedBlog = await blog.save();
    res.status(200).json({ success: true, message: 'Blog updated successfully.', blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update blog.', error: error.message });
  }
};

// Delete blog post (Admin protected)
exports.deleteBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Invalid blog ID format.' });
    }

    const blog = await Blog.findById(req.params.id).populate('authorId');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Blog deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete blog.', error: error.message });
  }
};

// Add comment to a blog (Public access)
exports.addComment = async (req, res) => {
  try {
    const { name, comment } = req.body;

    if (!name || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide both name and comment text.' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Invalid blog ID format.' });
    }

    const blog = await Blog.findById(req.params.id).populate('authorId');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    const newComment = {
      name: name.trim(),
      comment: comment.trim(),
      createdAt: new Date()
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      comments: blog.comments,
      newComment: blog.comments[blog.comments.length - 1]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add comment.', error: error.message });
  }
};

// Delete comment from a blog (Admin protected)
exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    blog.comments = blog.comments.filter((c) => c._id.toString() !== commentId);
    await blog.save();

    res.status(200).json({ success: true, message: 'Comment deleted successfully.', comments: blog.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete comment.', error: error.message });
  }
};

// Get all comments across blogs (Admin moderation / Command view)
exports.getAllComments = async (req, res) => {
  try {
    const blogs = await Blog.find({}, 'title comments');
    const allComments = [];

    blogs.forEach((blog) => {
      if (blog.comments && blog.comments.length > 0) {
        blog.comments.forEach((c) => {
          allComments.push({
            commentId: c._id,
            blogId: blog._id,
            blogTitle: blog.title,
            name: c.name,
            comment: c.comment,
            createdAt: c.createdAt
          });
        });
      }
    });

    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ success: true, count: allComments.length, comments: allComments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch comments.', error: error.message });
  }
};


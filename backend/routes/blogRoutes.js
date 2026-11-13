const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
router.get('/', blogController.getBlogs);
router.get('/admin/all-comments', authMiddleware, blogController.getAllComments);

router.get('/:id', blogController.getBlogById);
router.post('/:id/comments', blogController.addComment);

router.post('/', authMiddleware, blogController.createBlog);
router.put('/:id', authMiddleware, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);
router.delete('/:id/comments/:commentId', authMiddleware, blogController.deleteComment);

module.exports = router;

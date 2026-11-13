const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const authMiddleware = require('../middleware/authMiddleware');

// Public: get all authors (used in AddBlog dropdown)
router.get('/', authorController.getAuthors);
router.get('/:id', authorController.getAuthorById);

// Protected: manage authors
router.post('/', authMiddleware, authorController.createAuthor);
router.put('/:id', authMiddleware, authorController.updateAuthor);
router.delete('/:id', authMiddleware, authorController.deleteAuthor);

module.exports = router;

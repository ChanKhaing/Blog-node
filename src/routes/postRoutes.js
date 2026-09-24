const express = require('express');
const postController = require('../controllers/postController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', postController.home);
router.get('/posts', postController.index);

// Private routes - order matters: /posts/new before /posts/:id
router.get('/posts/new', requireAuth, postController.showCreate);
router.post('/posts', requireAuth, postController.create);
router.get('/dashboard', requireAuth, postController.dashboard);
router.get('/posts/:id/edit', requireAuth, postController.showEdit);
router.put('/posts/:id', requireAuth, postController.update);
router.delete('/posts/:id', requireAuth, postController.destroy);

// Public single post (kept last so it does not swallow /posts/new)
router.get('/posts/:id', postController.show);

module.exports = router;

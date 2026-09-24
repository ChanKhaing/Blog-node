const mongoose = require('mongoose');
const Post = require('../models/Post');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/** Homepage: hero + latest posts. */
exports.home = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(6).populate('author', 'email');
    res.render('home', { title: 'Inkwell - write and share your ideas', posts });
  } catch (err) {
    next(err);
  }
};

/** Public list of every post. */
exports.index = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'email');
    res.render('posts/index', { title: 'All posts', posts });
  } catch (err) {
    next(err);
  }
};

/** Posts belonging to the logged-in user. */
exports.dashboard = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.session.userId })
      .sort({ updatedAt: -1 })
      .populate('author', 'email');
    res.render('posts/dashboard', { title: 'Your posts', posts });
  } catch (err) {
    next(err);
  }
};

/** Public single post page. */
exports.show = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).render('404', { title: 'Post not found' });

    const post = await Post.findById(req.params.id).populate('author', 'email');
    if (!post) return res.status(404).render('404', { title: 'Post not found' });

    const isOwner = Boolean(
      req.session.userId && post.author && post.author._id.toString() === req.session.userId
    );
    res.render('posts/show', { title: post.title, post, isOwner });
  } catch (err) {
    next(err);
  }
};

exports.showCreate = (req, res) => {
  res.render('posts/form', {
    title: 'Write a new post',
    mode: 'create',
    errors: [],
    values: { title: '', content: '' },
    post: null,
  });
};

exports.create = async (req, res, next) => {
  const title = (req.body.title || '').trim();
  const content = (req.body.content || '').trim();
  const errors = [];

  if (!title) errors.push('Please add a title for your post.');
  if (title.length > 140) errors.push('Title must be 140 characters or fewer.');
  if (content.length < 20) errors.push('Content must be at least 20 characters long.');

  if (errors.length > 0) {
    return res.status(400).render('posts/form', {
      title: 'Write a new post',
      mode: 'create',
      errors,
      values: { title, content },
      post: null,
    });
  }

  try {
    const post = await Post.create({ title, content, author: req.session.userId });
    req.session.flash = { type: 'success', message: 'Post published.' };
    return res.redirect(`/posts/${post._id}`);
  } catch (err) {
    return next(err);
  }
};

exports.showEdit = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).render('404', { title: 'Post not found' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).render('404', { title: 'Post not found' });
    if (post.author.toString() !== req.session.userId) {
      return res.status(403).render('403', { title: 'Not allowed' });
    }

    return res.render('posts/form', {
      title: 'Edit post',
      mode: 'edit',
      errors: [],
      values: { title: post.title, content: post.content },
      post,
    });
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  const title = (req.body.title || '').trim();
  const content = (req.body.content || '').trim();
  const errors = [];

  if (!title) errors.push('Please add a title for your post.');
  if (title.length > 140) errors.push('Title must be 140 characters or fewer.');
  if (content.length < 20) errors.push('Content must be at least 20 characters long.');

  try {
    if (!isValidId(req.params.id)) return res.status(404).render('404', { title: 'Post not found' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).render('404', { title: 'Post not found' });
    if (post.author.toString() !== req.session.userId) {
      return res.status(403).render('403', { title: 'Not allowed' });
    }

    if (errors.length > 0) {
      return res.status(400).render('posts/form', {
        title: 'Edit post',
        mode: 'edit',
        errors,
        values: { title, content },
        post,
      });
    }

    post.title = title;
    post.content = content;
    await post.save();

    req.session.flash = { type: 'success', message: 'Post updated.' };
    return res.redirect(`/posts/${post._id}`);
  } catch (err) {
    return next(err);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).render('404', { title: 'Post not found' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).render('404', { title: 'Post not found' });
    if (post.author.toString() !== req.session.userId) {
      return res.status(403).render('403', { title: 'Not allowed' });
    }

    await post.deleteOne();
    req.session.flash = { type: 'success', message: 'Post deleted.' };
    return res.redirect('/dashboard');
  } catch (err) {
    return next(err);
  }
};

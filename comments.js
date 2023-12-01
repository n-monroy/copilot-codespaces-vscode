// Create web server with express

// Import express
const express = require('express');

// Create router
const router = express.Router();

// Import comment model
const Comment = require('../models/comment');

// Import authentication middleware
const auth = require('../middleware/auth');

// Import comment validation middleware
const validateComment = require('../middleware/validateComment');

// Import comment validation middleware
const validateObjectId = require('../middleware/validateObjectId');

// Import error middleware
const error = require('../middleware/error');

// GET: /api/comments
// Get all comments
router.get('/', async (req, res) => {
    const comments = await Comment.find().sort('name');
    res.send(comments);
});

// GET: /api/comments/:id
// Get comment by id
router.get('/:id', validateObjectId, async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        return res.status(404).send('Comment with the given ID was not found.');
    }

    res.send(comment);
});

// POST: /api/comments
// Create comment
router.post('/', [auth, validateComment], async (req, res) => {
    const comment = new Comment({
        name: req.body.name,
        email: req.body.email,
        text: req.body.text,
        articleId: req.body.articleId
    });

    await comment.save();

    res.send(comment);
});

// PUT: /api/comments/:id
// Update comment
router.put('/:id', [auth, validateObjectId, validateComment], async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        text: req.body.text,
        articleId: req.body.articleId
    }, { new: true });

    if (!comment) {
        return res.status(404).send('Comment with the given ID was not found.');
    }

    res.send(comment);
});

// DELETE: /api/comments/:id
// Delete comment
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const comment = await Comment.findByIdAndRemove(req.params.id);

    if (!comment) {
        return res.status(404).send('Comment with the given ID was not found.');
    }

    res.send(comment);
});

// Use error middleware
router.use(error);

// Export router
module.exports = router;
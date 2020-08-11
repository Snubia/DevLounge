const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

// bring the models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// route to get api/post
// access will be private because you have to be logged in to see a post
router.post(
  '/',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req); //checking for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');

      // variable for a new post
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();

      res.json(post); // we save that in a variable and make it avalaible.
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// The routed is going to be a get request to API/Post
// it will get all post and user will only see posts if they are logged in.

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // most recent post

    res.json(posts);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// The routed is going to be a get request to API/Post by id
// it will get all post and user will only see posts if they are logged in.

router.get('/:id', auth, async (req, res) => {
  try {
    //const posts = await Post.find().sort({ date: -1 }); // most recent post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// The routed is going to be a delete request to API/Post
// to delete a post
// first we have to find it by its id

router.get('/:id', auth, async (req, res) => {
  if (!post) {
    return res.statust(404).json({ msg: 'Post not found' });
  }
  try {
    const post = await Post.findById(req.params.id);

    // making sure only the owner of the post can delete it.
    // check user
    if (post.user.toString() !== req.user.id) {
      return res
        .status(402)
        .json({ msg: 'Sorry, you are not authorized to delete this post' });
    }

    await post.remove();

    res.json({ msg: 'Your Post has been successfully deleted!' });

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.status(500).send('Server Error');
  }
});

// This is a put request for likes
// it will have the id and is private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if a user has alreay like the post using the array method called filter
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.json(400).json({ msg: 'You have already liked this post' });
    }
    // else
    post.likes.unshift({ user: req.user.id });

    // now saving it to the database
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// This is a put request to unlike
// it will have the id and is private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if a user has alreay like the post using the array method called filter
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.json(400).json({ msg: 'The post has not yet been liked' });
    }
    // remove like
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    // now saving it to the database
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// route to Post api/post / comment/: id
// Allow user to post comment, it will have the user attached to it
router.post(
  '/comment/:id',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req); //checking for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      // variable for a new comment
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      // adding new comment to the post
      post.comments.unshift(newComment);

      await post.save(); // saving to the api

      res.json(post.comments); // we save that in a variable and make it avalaible.
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Route: Delete comment api/posts/comment/:id/:comment_id
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // pull comment from the post using the find method
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // verify the comment exist
    if (!comment) {
      return req.status(404).json({ msg: 'No comment found' });
    }
    // verifying the user deleting the comment is the one who made it
    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'you are not authorized to delete this comment' });
    }
    // remove like
    const removeIndex = post.comments
      .map((comments) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    // now saving it to the database
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

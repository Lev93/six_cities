/* eslint no-underscore-dangle: 0 */

const { Router } = require('express');
const User = require('../models/user');
const Item = require('../models/item');
const Comment = require('../models/comment');

const router = Router();

router.post('/add', async (req, res) => {
  const {
    text,
    rating,
    itemId,
    userId,
    language,
  } = req.body;
  const user = await User.findById(userId);
  const newComment = new Comment({
    apartamentId: itemId,
    userId,
    userName: user.name,
    userAvatar: user.avatar,
    text,
    rating,
    language,
  });
  try {
    await newComment.save();
    const item = await Item.findById(itemId);
    const comments = await Comment.find({ apartamentId: itemId });
    const newRating = comments.reduce((acc, cur) => acc + cur.rating, 0) / comments.length;
    await item.addRating(newRating);
    await item.addComment();
    res.send({ comments });
  } catch (e) {
    console.log(e);
  }
});

router.post('/get', async (req, res) => {
  const { itemId } = req.body;
  const comments = await Comment.find({ apartamentId: itemId });
  try {
    res.send({ comments });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

const { Schema, model } = require('mongoose');

const comment = new Schema({
  apartamentId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  userName: String,
  userAvatar: String,
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  language: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Comment', comment);

const { Schema, model } = require('mongoose');

const item = new Schema({
  city: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  premium: Boolean,
  price: {
    type: Number,
    required: true,
  },
  mainImg: String,
  images: [String],
  type: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  userAvatar: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  userName: String,
  text: String,
  features: {
    entire: String,
    bedrooms: Number,
    persons: Number,
  },
  comments: Number,
  insideitem: [String],
  location: {
    latitude: String,
    longitude: String,
  },
  language: String,
});

item.methods.addRating = function (newRating) {
  this.rating = newRating;
  return this.save();
};

item.methods.addComment = function () {
  this.comments += 1;
  return this.save();
};

module.exports = model('Item', item);

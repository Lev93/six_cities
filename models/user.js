/* eslint no-underscore-dangle: 0 */
/* eslint func-names: 0 */
/* eslint consistent-return: 0 */
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExp: Date,
  avatar: String,
  pro: Boolean,
  password: {
    type: String,
    required: true,
  },
  bookmarks: {
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: 'Item',
          required: true,
        },
      },
    ],
  },
  apartaments: {
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: 'Item',
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addPro = function () {
  this.pro = true;
  return this.save();
};

userSchema.methods.addApartament = function (item) {
  const items = [...this.apartaments.items];
  const idx = items.findIndex((c) => c.itemId.toString() === item._id.toString());

  if (idx >= 0) {
    return;
  }
  items.push({
    itemId: item._id,
  });
  this.apartaments = { items };
  return this.save();
};

userSchema.methods.removeApartament = function (id) {
  let items = [...this.bookmarks.items];

  items = items.filter((c) => c.itemId.toString() !== id.toString());

  this.bookmarks = { items };
  return this.save();
};

userSchema.methods.addToBook = function (item) {
  const items = [...this.bookmarks.items];
  const idx = items.findIndex((c) => c.itemId.toString() === item._id.toString());

  if (idx >= 0) {
    return;
  }
  items.push({
    itemId: item._id,
  });
  this.bookmarks = { items };
  return this.save();
};

userSchema.methods.removeFromBook = function (id) {
  let items = [...this.bookmarks.items];

  items = items.filter((c) => c.itemId.toString() !== id.toString());

  this.bookmarks = { items };
  return this.save();
};

module.exports = model('User', userSchema);

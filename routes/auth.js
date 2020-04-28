/* eslint no-underscore-dangle: 0 */

const { Router } = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const uniqid = require('uniqid');
const User = require('../models/user');
const Item = require('../models/item');
const keys = require('../keys');
const regEmail = require('../emails/registration');
const fileMiddleware = require('../middleware/file');

const router = Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'levriabov12345678@gmail.com',
    pass: keys.API_KEY,
  },
});

router.post('/user', async (req, res) => {
  const { id } = req.body;
  const user = await User.findOne({ _id: id });
  if (user.apartaments.items.length >= 3) {
    user.addPro();
  }
  if (user) {
    res.send(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          pro: user.pro,
          bookmarks: user.bookmarks,
          apartaments: user.apartaments,
        },
      },
    );
  }
});

router.post('/bookmarks', async (req, res) => {
  const { itemId, userId } = req.body;
  const user = await User.findById(userId);
  const item = await Item.findById(itemId);
  await user.addToBook(item);
  if (user) {
    res.send(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          pro: user.pro,
          bookmarks: user.bookmarks,
          apartaments: user.apartaments,
        },
      },
    );
  }
});

router.post('/deletebookmark', async (req, res) => {
  const { itemId, userId } = req.body;
  const user = await User.findById(userId);
  await user.removeFromBook(itemId);
  if (user) {
    res.send(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          pro: user.pro,
          bookmarks: user.bookmarks,
          apartaments: user.apartaments,
        },
      },
    );
  }
});

router.post('/registration', fileMiddleware.single('avatar'), async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const olduser = await User.findOne({ email });
    if (olduser) {
      res.send({ error: 'auth.regerror' });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      let avatar = '';
      if (req.file) {
        avatar = req.file.path.replace('public', '..');
      }
      const user = new User({
        email, name, password: hashPassword, pro: false, avatar,
      });
      await user.save();
      await transporter.sendMail(regEmail(email));
      res.send(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar,
            pro: false,
            bookmarks: { items: [] },
            apartaments: { items: [] },
          },
          localstorage: {
            token: uniqid(),
            expiresIn: 3600,
          },
        },
      );
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);
      if (areSame) {
        res.send(
          {
            user: {
              id: candidate._id,
              name: candidate.name,
              email: candidate.email,
              avatar: candidate.avatar,
              pro: false,
              bookmarks: candidate.bookmarks,
              apartaments: candidate.apartaments,
            },
            localstorage: {
              token: uniqid(),
              expiresIn: 3600,
            },
          },
        );
      } else {
        res.send({ error: 'auth.paserror' });
      }
    } else {
      res.send({ error: 'auth.usererror' });
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

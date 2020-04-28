/* eslint no-underscore-dangle: 0 */

const { Router } = require('express');
const Item = require('../models/item');
const User = require('../models/user');
const fileMiddleware = require('../middleware/file');

const router = Router();

router.post('/', async (req, res) => {
  const { city } = req.body;
  const items = await Item.find({ city }).populate('userId', 'email name');
  res.send(items);
});

router.post('/getitems', async (req, res) => {
  const { apart, book } = req.body;
  let apartaments = [];
  let bookmarks = [];
  if (apart) {
    apartaments = await Item.find({
      _id: { $in: [...apart.map((el) => el.itemId)] },
    });
  }
  if (book) {
    bookmarks = await Item.find({
      _id: { $in: [...book.map((el) => el.itemId)] },
    });
  }
  res.send({ apartaments, bookmarks });
});

router.post('/sort', async (req, res) => {
  const { city, sortType } = req.body;
  const sortObject = {};
  if (sortType === 'TopRated') {
    sortObject.rating = -1;
  }
  if (sortType === 'PriceHigh') {
    sortObject.price = -1;
  }
  if (sortType === 'PriceLow') {
    sortObject.price = 1;
  }
  if (sortType === 'Popular') {
    sortObject.comments = -1;
  }
  const items = await Item.find({ city }).sort({ ...sortObject });
  res.send(items);
});

router.post('/item', async (req, res) => {
  const item = await Item.findById(req.body.id);
  const offers = await Item.find({ city: req.body.city });

  const lenght = (point1, point2) => Math.sqrt(
    (point2.latitude - point1.latitude) ** 2 + (point2.longitude - point1.longitude) ** 2,
  );
  const neighbourhood = offers.sort((a, b) => lenght(item.location, a.location)
  - lenght(item.location, b.location)).slice(1, 4);

  res.send({
    item,
    offers,
    neighbourhood,
  });
});

router.post('/add', fileMiddleware.array('images'), async (req, res) => {
  console.log(req.body);
  const item = new Item({
    city: req.body.city,
    title: req.body.title,
    premium: req.body.premium,
    price: req.body.price,
    mainImg: req.files[0].path.replace('public', '..'),
    images: req.files.slice(1).map((el) => el.path.replace('public', '..')),
    type: req.body.type,
    userAvatar: req.body.userAvatar,
    userId: req.body.userId,
    userName: req.body.userName,
    text: req.body.text,
    features: {
      entire: req.body.featuresentire,
      bedrooms: req.body.featuresbedrooms,
      persons: req.body.featurespersons,
    },
    insideitem: req.body.insideitem,
    location: {
      latitude: req.body.locationlatitude,
      longitude: req.body.locationlongitude,
    },
    rating: 0,
    comments: 0,
    language: req.body.language,
  });
  try {
    await item.save();
    const user = await User.findById(req.body.userId);
    await user.addApartament(item);
    if (user.apartaments.items.length >= 3) {
      user.addPro();
    }
    res.send(200);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

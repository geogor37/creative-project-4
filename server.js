const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

// connect to the database
mongoose.connect('mongodb://localhost:27017/wishlist', {
  useNewUrlParser: true
});

// Create a schema for wishlists
const wishlistSchema = new mongoose.Schema({
  name: String,
  items: [{ type: String }]
});

// Create a model for wishlists.
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// Get all the wishlists that have been created.
app.get('/api/wishlists', async (req, res) => {
  try {
    let wishlists = await Wishlist.find();
    res.send(wishlists);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Create a new wishlist; takes a title for the list.
app.post('/api/wishlists', async (req, res) => {
  const wishlist = new Wishlist({
    name: req.body.title,
    items: []
  });
  try {
    await wishlist.save();
    res.send(wishlist);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));

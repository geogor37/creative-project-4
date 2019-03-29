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

app.put('/api/wishlists/:id', async (req, res) => {
  let id = req.params.id;
  let newName = req.body.name;
  console.log("ID to modify: " + id);
  let list = await Wishlist.findOne({
    _id: id
  });
  list.name = newName;
  list.save();
  res.send(list);
});

// Delete the wishlist with the given ID.
app.delete('/api/wishlists/:id', async (req, res) => {
  let id = req.params.id;
  console.log("ID to delete: " + id);
  await Wishlist.deleteOne({
    _id: id
  });
  res.sendStatus(200);
});

// Add an item to the wishlist with the given ID.
app.post('/api/wishlists/:id/items', async (req, res) => {
  let id = req.params.id;
  let item = req.body.item;
  console.log("ID to add item to: " + id);
  let wishlist = await Wishlist.findOne({
    _id: id
  });
  console.log("Item to be added: " + item);
  wishlist.items.push(item);
  wishlist.save();
  res.send(item);
});

app.delete('/api/wishlists/:id/items/:item', async (req, res) => {
  let id = req.params.id;
  let item = req.params.item;
  console.log("Item to delete: " + item);
  let wishlist = await Wishlist.findOne({
    _id: id
  });
  wishlist.items.splice(wishlist.items.indexOf(item), 1);
  wishlist.save();
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));

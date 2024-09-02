// backend for the tool
const express = require('express');
const fs = require('fs');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 8000;

app.use(express.json());
app.use(express.static('public'));

// https://developer.hypixel.net/dashboard
const apiKey = '19e207c4-93d9-4a64-9037-1366277f4f25';
const itemToTrack = 'SPECIFIC_ITEM_ID';

//const apiUrl = `https://api.hypixel.net/skyblock/auctions?key=${apiKey}&item=${itemToTrack}`;

// https://sky.coflnet.com/api/auctions/tag/{ITEM_ID}/active/bin
// assume i have a list of item ids
// for each item id
//
let itemIds = ['PET_LION'];
let lbins = {};

// for (const itemId of itemIds) {
//     const apiUrl = `https://sky.coflnet.com/api/auctions/tag/${itemId}/active/bin`;
//     // this fetch will return a list of 10 objects, each object has a structure of {id, price}
//     // i want to store the price in lbins
//     fetch(apiUrl)
//       .then(response => response.json())
//       .then(data => {
//         // store startingBid in lbins
//         lbins.push(data[0]['startingBid']);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
// }

async function fetchPrice() {
  lbins = {};

}

// homepage show item list
app.get('/', (req, res) => {
  res.redirect('/update');
});

app.get('/update', (req, res) => {
  const items = JSON.parse(fs.readFileSync("./data/holding.json"));
  res.json(items);
});

app.post('/submit', (req, res) => {
  const itemName = req.body['item-name'];
  const itemQuantity = req.body['item-quantity'];
  const itemPrice = req.body['item-price'];

  // Process the data here
  console.log(`Received form data: ${itemName}, ${itemQuantity}, ${itemPrice}`);

  // Return a response to the client
  res.send('Form data received successfully!');
});

// Use a web server to listen at port 8000
app.listen(port, () => {
  console.log("The server has started at http://localhost:8000/");
});
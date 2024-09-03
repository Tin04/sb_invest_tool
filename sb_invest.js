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
let apiKey;

//const apiUrl = `https://api.hypixel.net/skyblock/auctions?key=${apiKey}&item=${itemToTrack}`;

// https://sky.coflnet.com/api/auctions/tag/{ITEM_ID}/active/bin
// assume i have a list of item ids
// for each item id

// homepage show item list
app.get('/', (req, res) => {
  res.redirect('/update');
});

// update the newest price for invested items
app.get('/update', async (req, res) => {
  const items = JSON.parse(fs.readFileSync("./data/holding.json"));
  // Get the first key from the object
  const itemKeys = Object.keys(items);
  // let itemTag;
  // let apiUrl;  // will this better as no create and delete obj?

  // Loop through the keys and access the corresponding values

  // Array to store all fetch promises
  const fetchPromises = itemKeys.map(key => {
    const itemTag = items[key]['itemTag'];
    const apiUrl = `https://sky.coflnet.com/api/item/price/${itemTag}/bin`;

    return fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        items[key]['price'] = data['lowest'];
        console.log(items[key]['price']);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  });

  try {
    // Wait for all fetch promises to resolve
    await Promise.all(fetchPromises);

    // Save the updated data to the JSON file
    fs.writeFileSync("./data/holding.json", JSON.stringify(items, null, " "));

    // Send the updated items in the response
    res.json(items);
  } catch (error) {
    console.error('Error updating prices:', error);
    res.status(500).send('Error updating prices');
  }
});

// update your investment holdings
app.post('/submit', (req, res) => {
  const itemName = req.body['item-name'];
  const itemQuantity = req.body['item-quantity'];
  const itemPrice = req.body['item-price'];

  // Process the data here
  console.log(`Received form data: ${itemName}, ${itemQuantity}, ${itemPrice}`);
  // open and update the holding.json
  

});

// Use a web server to listen at port 8000
app.listen(port, () => {
  console.log("The server has started at http://localhost:8000/");
});
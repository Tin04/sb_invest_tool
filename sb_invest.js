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
let apiKey = 'fdbb7790-7e8d-4faf-b503-ab23d98b2f41';

//const apiUrl = `https://api.hypixel.net/skyblock/auctions?key=${apiKey}&item=${itemToTrack}`;

// https://sky.coflnet.com/api/auctions/tag/{ITEM_ID}/active/bin
// assume i have a list of item ids
// for each item id

// homepage show item list
app.get('/', (req, res) => {
  res.redirect('/api/update');
});

// update the newest price for invested items
app.get('/api/update', async (req, res) => {
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
        //console.log(items[key]['price']);
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

// update your investment holdings reocrd
app.post('/api/record', (req, res) => {
  const { itemName, itemTag, itemQuantity, itemPrice, action} = req.body;
  const items = JSON.parse(fs.readFileSync("./data/holding.json"));

  // ensure valid input from user
  if (!itemName || !itemQuantity || !itemPrice || !action) {
      res.json({ status: "error", error: "Missing record data." });
      return;
  } 
  const parsedQuantity = parseFloat(itemQuantity);
  if (isNaN(parsedQuantity)) {
    res.json({ status: "error", error: "Invalid item quantity." });
    return;
  }
  const parsedPrice = parseFloat(itemPrice);
  if (isNaN(parsedPrice)) {
    res.json({ status: "error", error: "Invalid item price." });
    return;
  }

  if (itemName in items) {
    // can update incorrect itemTag
    if (itemTag != "") {
      items[itemName]['itemTag'] = itemTag;
    }
    if (action === "buy") {
      items[itemName]['avgCost'] = (items[itemName]['avgCost'] * items[itemName]['quantity'] + parsedPrice * parsedQuantity) / (items[itemName]['quantity'] + parsedQuantity);
      items[itemName]['quantity'] = parseFloat(items[itemName]['quantity']) + parsedQuantity;
    } else {
      // if holding < amount
      if (items[itemName]['quantity'] < parsedQuantity) {
        res.json({ status: "error", error: "Not enough holding." });
        return;
      }
      items[itemName]['profit'] = (itemPrice - items[itemName]['avgCost']) * parsedQuantity;
      items[itemName]['quantity'] = parseFloat(items[itemName]['quantity']) - parsedQuantity;
    }
  } else {
    // new item
    // new item need provide itemTag
    if (!itemTag) {
      res.json({ status: "error", error: "Missing item tag." });
      return;
    } 
    if (action === "sell") {
      res.json({ status: "error", error: "Cannot sell untracked item." });
      return;
    }    
    items[itemName] = { itemTag, quantity: parsedQuantity, price: parsedPrice, avgCost: parsedPrice, profit: 0 };
  }

  fs.writeFileSync("./data/holding.json", JSON.stringify(items, null, " "));
  res.json({ status: "success"});
});

app.get('/api/firesale', (req, res) => {
  const apiUrl = 'https://api.hypixel.net/v2/skyblock/firesales';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data['success'] === false) {
        res.json({ status: "error", error: "Fail to fetch data" });
      } else {
        res.json({ status: "success", data: data['sales'][0] });
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

// API route for fetching price history
app.post('/api/history', async (req, res) => {
  const { itemName, timeRange } = req.body;

  if (!itemName) {
    return res.status(400).json({ error: 'Item name is required' });
  }

  try {
    const response = await fetch(`https://sky.coflnet.com/api/item/price/${itemName}/history/${timeRange}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    if (!data) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Fetching error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Use a web server to listen at port 8000
app.listen(port, () => {
  console.log("The server has started at http://localhost:8000/");
});
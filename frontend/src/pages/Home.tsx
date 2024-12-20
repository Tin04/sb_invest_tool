import React, { useState, useEffect } from 'react';
import Timer from '../components/FiresaleTimer';
import RecordForm from '../components/RecordForm';
import ItemList from '../components/ItemList';
import '../styles/style.css';
import { Item } from '../types/Item';

function Home() {
  const [items, setItems] = useState<Record<string, Item>>({});
  const [totalCost, setTotalCost] = useState('');
  const [totalWorth, setTotalWorth] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        try {
          // ensure init data fetched before rendering
            await fetchItems();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();
}, []);

  const fetchItems = () => {
    fetch(import.meta.env.VITE_BACKEND_HOST + "/api/update")
        .then(response => response.json())
        .then(data => {
            calculateTotals(data['totalCost'], data['totalWorth']);
            setItems(data['items']);   
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  };

  const calculateTotals = (cost: string, worth: string) => {
    setTotalCost(cost);
    setTotalWorth(worth);
  };

  const handleUpdatePrices = async () => {
    await fetchItems();
  };

  const fetchData = () => {
    fetch(import.meta.env.VITE_BACKEND_HOST + "/api/data")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  };
  const handleUpdateData = async () => {
    await fetchData();
  };

  return (
    <div id="content">
      <Timer />
      <RecordForm fetchData={fetchItems} />
      <div id="item-list-header">
        <div id="item-list-title">
          <h2 id="list-title">Item List</h2>
          <button id="update-button" onClick={handleUpdatePrices}>Update List</button>
          <button id="udpate-data" onClick={handleUpdateData}>Update Data</button>
        </div>
        <div id="total-values">
          <div id="total-cost">Invested total: <span id="total-cost-value">{totalCost}</span></div>
          <div id="total-worth">Worth total: <span id="total-worth-value">{totalWorth}</span></div>
        </div>
      </div>
      <ItemList items={items} />
    </div>
  );
}

export default Home;
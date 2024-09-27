import React, { useState, useEffect } from 'react';
import Timer from '../components/FiresaleTimer';
import RecordForm from '../components/RecordForm';
import ItemList from '../components/ItemList';
import '/styles/style.css';

interface Item {
  itemTag: string;
  quantity: number;
  avgCost: number;
  profit: number;
  price: number;
}

function Home() {
  const [items, setItems] = useState<Record<string, Item>[]>([]);
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

  const calculateTotals = (cost: number, worth: number) => {
    setTotalCost(cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    setTotalWorth(worth.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  };

  const handleUpdatePrices = async () => {
    await fetchItems();
  };

  return (
    <div id="content">
      <Timer />
      <RecordForm fetchData={fetchItems} />
      <div id="item-list-header">
        <div id="item-list-title">
          <h2 id="list-title">Item List</h2>
          <button id="update-button" onClick={handleUpdatePrices}>Update List</button>
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
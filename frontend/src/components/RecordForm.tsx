import React, { useState } from 'react';
import SearchBar from './SearchBar';

interface Suggestion {
  name: string;
  id: string;
  type: string;
  iconUrl: string;
  img: string;
  tier: string;
}

interface RecordFormProps {
  fetchData: () => void;
}

function RecordForm({ fetchData }: RecordFormProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    itemTag: '',
    itemQuantity: 0,
    itemPrice: 0,
    action: 'buy'
  });
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemSelect = (item: Suggestion) => {
    setFormData(prevData => ({
      ...prevData,
      itemName: item.name,
      itemTag: item.id,
      // You can also set other fields based on the selected item if needed
      // For example: itemTag: item.type,
    }));
    setSearchValue(item.name);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setFormData(prevData => ({
      ...prevData,
      itemName: value,
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.itemName === "" ||
      formData.itemTag === "" ||  // check this in backend

      formData.itemQuantity === 0 ||
      formData.itemPrice === 0
      // additional notes can be empty
    ) {
      window.alert("Please fill in all the required fields!");
      return;
    }
// Assuming the first account is the active one
    fetch(import.meta.env.VITE_BACKEND_HOST + "/api/record", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...formData}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit form');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "error") {
              window.alert(data.error);
            } else {
              window.alert('Form submitted successfully!');
              fetchData();
            }
            setFormData({
                itemName: '',
                itemTag: '',
                itemQuantity: 0,
                itemPrice: 0,
                action: 'buy'
            });
            setSearchValue('');
        })
        .catch(error => {
            console.error('Error submitting form:', error);
        });
  };

  return (
    <div id="dropdown-form">
      <div id="toggle-bar" onClick={() => setIsFormVisible(!isFormVisible)}>Input Your Record</div>
      {isFormVisible && (
        <form id="record-form" onSubmit={handleSubmit}>
          <label htmlFor="itemName">Item Name:</label>
          <SearchBar
            onSelect={handleItemSelect}
            name="itemName"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <label htmlFor="itemQuantity">Item Quantity:</label>
          <input type="number" id="itemQuantity" name="itemQuantity" value={formData.itemQuantity} onChange={handleInputChange} /><br /><br />
          <label htmlFor="itemPrice">Item Cost (average):</label>
          <input type="number" id="itemPrice" name="itemPrice" value={formData.itemPrice} onChange={handleInputChange} /><br /><br />
          <label htmlFor="action">Action:</label>
          <select id="action" name="action" value={formData.action} onChange={handleInputChange}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select><br /><br />
          <button id="submit-button" type="submit">Submit</button>
          <div id="record-message" className="warning center"></div>
        </form>
      )}
    </div>
  );
}

export default RecordForm;
import React, { useState } from 'react';


function RecordForm() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    itemTag: '',
    itemQuantity: 0,
    itemPrice: 0,
    action: 'buy'
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.itemName === "" ||
      // formData.itemTag === "" ||  // check this in backend

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
            console.log('Form submitted successfully! Response:', data);
            window.alert('Form submitted successfully!');
            setFormData({
                itemName: '',
                itemTag: '',
                itemQuantity: 0,
                itemPrice: 0,
                action: 'buy'
            });
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
          <input type="text" id="itemName" name="itemName" value={formData.itemName} onChange={handleInputChange} /><br /><br />
          <label htmlFor="itemTag">Item Tag (Metadata):</label>
          <input type="text" id="itemTag" name="itemTag" value={formData.itemTag} onChange={handleInputChange} /><br /><br />
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
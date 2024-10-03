import React, { useState, useEffect } from 'react';

interface FiresaleItem {
  item_id: string;
  start: number;
  end: number;
  amount: number;
  price: number;
}

function FiresaleTimer() {
  const [firesaleItems, setFiresaleItems] = useState<FiresaleItem[]>([]);
  const [countdown, setCountdown] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchFiresale();
      const interval = setInterval(fetchFiresale, 60000); // Refresh every minute
      return () => clearInterval(interval);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (firesaleItems.length > 0) {
      const timer = setInterval(() => {
        setCountdown(calculateCountdown(firesaleItems[0].start));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [firesaleItems]);

  const fetchFiresale = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_HOST + "/api/firesale");
      const data = await response.json();
      if (data.success && data.sales) {
        setFiresaleItems(data.sales);
      } else {
        console.error("Error fetching firesale data:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const calculateCountdown = (startTime: number): string => {
    const now = new Date().getTime();
    const distance = startTime - now;
    if (distance < 0) return "Event has started!";
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div id="timer">
      {firesaleItems.length === 0 ? (
        <p>No scheduled firesales</p>
      ) : (
        <>
          <div className="timer-header">
            <h3>Firesale Countdown: <span className="countdown">{countdown}</span></h3>
            <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`} onClick={toggleDropdown}>▼</span>
          </div>
          <div className={`dropdown-content ${isOpen ? 'open' : ''}`}>
            <div className="dropdown-scroll">
              {firesaleItems.map((item) => (
                <div key={item.item_id} className="firesale-item">
                  <h3>{item.item_id.replace(/_/g, ' ')}</h3>
                  <p>Amount: {item.amount}</p>
                  <p>Price: {item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FiresaleTimer;
import React, { useState, useEffect } from 'react';

function FiresaleTimer() {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // just get the time, no need know the exact item
    const fetchData = async () => {
      try {
        // ensure init data fetched before rendering
          await fetchFiresale();
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const fetchFiresale = () => {
    fetch(import.meta.env.VITE_BACKEND_HOST + "/api/firesale")
        .then(response => response.json())
        .then(data => {
            if (data['status'] === "error") {
                setCountdown(data['error']);
            } else {
                if (!('data' in data)) {
                    setCountdown("No scheduled firesale");
                } else {
                    console.log(1);
                    const eventDate = new Date(data['data']['start']).getTime();
                    const timer = setInterval(function() {
                        const now = new Date().getTime();
                        const distance = eventDate - now;
                        if (distance < 0) {
                            clearInterval(timer);
                            setCountdown("Event has started!");
                            return;
                        }
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                }, 1000);
                setCountdown("Firesale data updated successfully.");
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
  }

  return (
    <div id="timer">Fire Sale Countdown: <span id="countdown">{countdown}</span></div>
  );
}

export default FiresaleTimer;
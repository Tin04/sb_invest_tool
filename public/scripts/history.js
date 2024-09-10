document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('history-form');
    const chartContainer = document.getElementById('chart-container');
    let priceChart = null;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemName = document.getElementById('item-name').value;
        const timeRange = document.getElementById('time-range').value;

        try {
            const response = await fetch('/api/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemName: itemName,
                    timeRange: timeRange
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const times = data.map(item => new Date(item.time).getTime());
            console.log(times);
            //console.log(data);

            drawChart(data, itemName, timeRange);
        } catch (error) {
            console.error('Error:', error);
            chartContainer.innerHTML = '<p>Error fetching data. Please try again.</p>';
        }
    });

    function drawChart(data, itemName, timeRange) {
        const ctx = document.getElementById('price-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (priceChart) {
            priceChart.destroy();
        }

        priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => new Date(item.time).getTime()),
                datasets: [
                    {
                        label: 'Average Price',
                        data: data.map(item => item.avg),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Average Price History for ${itemName} (${getTimeRangeText(timeRange)})`
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: getTimeUnit(timeRange)
                        }
                    }
                }
            }
        });
    }

    function getTimeRangeText(range) {
        switch(range) {
            case 'day': return 'Last 24 Hours';
            case 'week': return 'Last 7 Days';
            case 'month': return 'Last 30 Days';
            case 'full': return 'All Time';
            default: return '';
        }
    }

    function getTimeUnit(range) {
        switch(range) {
            case 'day': return 'hour';
            case 'week': return 'day';
            case 'month': return 'day';
            case 'full': return 'month';
            default: return 'day';
        }
    }
});
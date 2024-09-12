$(function() {
    const form = $('#history-form');
    const chartContainer = $('#chart-container');
    let priceChart = null;

    form.on('submit', async (e) => {
        e.preventDefault();
        const itemName = $('#item-name').val();
        const timeRange = $('#time-range').val();

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
            drawChart(data, itemName, timeRange);

            displayAnalysis(data);  // Add this line
        } catch (error) {
            console.error('Error:', error);
            chartContainer.html('<p>Error fetching data. Please try again.</p>');
        }
    });

    function drawChart(data, itemName, timeRange) {
        const ctx = $('#price-chart').get(0).getContext('2d');

        // Calculate moving average (5-day window)
        const movingAverageWindow = 5;
        const movingAverage5Data = calculateMovingAverage(data, 5);
        const movingAverage10Data = calculateMovingAverage(data, 10);
        const movingAverage30Data = calculateMovingAverage(data, 30);

        // Calculate basic statistics
        const stats = calculateStatistics(data);
        
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
                    },
                    {
                        label: `ma5`,
                        data: movingAverage5Data,
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0
                    },
                    {
                        label: `ma10`,
                        data: movingAverage10Data,
                        borderColor: 'rgb(54, 162, 235)', 
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0
                    },
                    {
                        label: `ma30`,
                        data: movingAverage30Data,
                        borderColor: 'rgb(153, 102, 255)', 
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0
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
                    },
                    subtitle: {
                        display: true,
                        text: `Trend: ${stats.trend}, Max: ${stats.max}, Min: ${stats.min}, Avg: ${stats.average}`
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
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Price'
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

    function calculateMovingAverage(data, window) {
        const movingAverages = [];
        for (let i = window - 1; i < data.length; i++) {
            const windowSlice = data.slice(i - window + 1, i + 1);
            const sum = windowSlice.reduce((acc, item) => acc + item.avg, 0);
            movingAverages.push({x: new Date(data[i].time), y: sum / window});
        }
        return movingAverages;
    }
    
    function calculateStatistics(data) {
        const prices = data.map(item => item.avg);
        const max = Math.max(...prices).toFixed(2);
        const min = Math.min(...prices).toFixed(2);
        const average = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
    
        // Calculate linear regression
        const { slope, trend } = calculateLinearRegression(data);
    
        // Calculate price change percentage
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        const priceChangePercent = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(2);
    
        return { max, min, average, trend, slope, priceChangePercent };
    }
    
    function calculateLinearRegression(data) {
        const n = data.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
        data.forEach((item, index) => {
            sumX += index;
            sumY += item.avg;
            sumXY += index * item.avg;
            sumX2 += index * index;
        });
    
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
    
        // Determine trend based on slope
        let trend;
        if (slope > 0.001) {
            trend = 'Upward';
        } else if (slope < -0.001) {
            trend = 'Downward';
        } else {
            trend = 'Stable';
        }
    
        return { slope, intercept, trend };
    }

    function displayAnalysis(data) {
        const analysisContainer = $('#analysis-container');
        const stats = calculateStatistics(data);
        
        const content = `
            <h3>Price Trend Analysis</h3>
            <p><strong>Overall Trend:</strong> ${stats.trend}</p>
            <p><strong>Price Change:</strong> ${stats.priceChangePercent}%</p>
            <p><strong>Trend Strength:</strong> ${Math.abs(stats.slope).toFixed(4)} (${stats.slope > 0 ? 'positive' : 'negative'})</p>
            <p><strong>Maximum Price:</strong> $${stats.max}</p>
            <p><strong>Minimum Price:</strong> $${stats.min}</p>
            <p><strong>Average Price:</strong> $${stats.average}</p>
            <p><strong>Price Volatility:</strong> ${calculateVolatility(data).toFixed(2)}%</p>
        `;
        
        analysisContainer.html(content);
    }
    
    function calculateVolatility(data) {
        const prices = data.map(item => item.avg);
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i-1]) / prices[i-1]);
        }
        const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const squaredDifferences = returns.map(r => Math.pow(r - meanReturn, 2));
        const variance = squaredDifferences.reduce((a, b) => a + b, 0) / squaredDifferences.length;
        const volatility = Math.sqrt(variance) * Math.sqrt(365) * 100; // Annualized volatility
        return volatility;
    }
});
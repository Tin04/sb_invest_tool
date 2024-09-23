import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { getTimeRangeText, getTimeUnit, calculateMovingAverage, calculateStatistics, calculateVolatility } from '../utils/historyHelpers.tsx';
import '/styles/style.css';

Chart.register(...registerables);

interface HistoryData {
  min: number;
  max: number;
  avg: number;
  time: string;
  volume: number;
}

const History: React.FC = () => {
  const [itemName, setItemName] = useState('');
  const [timeRange, setTimeRange] = useState('day');
  const [chartData, setChartData] = useState<HistoryData[]>([]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartData.length > 0) {
      drawChart();
      displayAnalysis(chartData);
    }
  }, [chartData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_HOST + '/api/history', {
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
      setChartData(data);
    } catch (error) {
      console.error('Error:', error);
      // Handle error display
    }
  };

  const drawChart = () => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const movingAverage5Data = calculateMovingAverage(chartData, 5);
        const movingAverage10Data = calculateMovingAverage(chartData, 10);
        const movingAverage30Data = calculateMovingAverage(chartData, 30);
        const stats = calculateStatistics(chartData);

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartData.map(item => new Date(item.time).getTime()),
            datasets: [
              {
                label: 'Avg',
                data: chartData.map(item => item.avg),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: false,
                yAxisID: 'y'
              },
              {
                label: 'Min',
                data: chartData.map(item => item.min),
                borderColor: 'rgb(75, 96, 96)',
                backgroundColor: 'rgba(75, 96, 96, 0.2)',
                tension: 0.1,
                fill: false,
                yAxisID: 'y'
              },
              {
                label: 'Max',
                data: chartData.map(item => item.max),
                borderColor: 'rgb(192, 192, 20)',
                backgroundColor: 'rgba(192, 192, 20, 0.2)',
                tension: 0.1,
                fill: false,
                yAxisID: 'y'
              },
              {
                label: 'ma5',
                data: movingAverage5Data,
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                yAxisID: 'y'
              },
              {
                label: 'ma10',
                data: movingAverage10Data,
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                yAxisID: 'y'
              },
              {
                label: 'ma30',
                data: movingAverage30Data,
                borderColor: 'rgb(153, 102, 255)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                yAxisID: 'y'
              },
              {
                label: 'Volume',
                data: chartData.map(item => (item.volume)),
                type: 'bar',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                yAxisID: 'y1'
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
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Price'
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                  drawOnChartArea: false
                },
                title: {
                  display: true,
                  text: 'Volume'
                },
                min: 0
              }
            }
          }
        });
      }
    }
  };

  const displayAnalysis = (data: HistoryData[]) => {
    const stats = calculateStatistics(data);
    const volatility = calculateVolatility(data);
    
    setAnalysisData({
      trend: stats.trend,
      priceChangePercent: stats.priceChangePercent,
      trendStrength: Math.abs(stats.slope).toFixed(4),
      trendDirection: stats.slope > 0 ? 'positive' : 'negative',
      max: stats.max,
      min: stats.min,
      average: stats.average,
      volatility: volatility.toFixed(2)
    });
  };

  return (
    <div id="app-container">
      <div>
        <h2>Price History</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="item-name">Item Tag:</label>
          <input
            type="text"
            id="item-name"
            name="item-name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
          <label htmlFor="time-range">Time Range:</label>
          <select
            id="time-range"
            name="time-range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            required
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="full">All Time</option>
          </select>
          <button type="submit">Get History</button>
        </form>
      </div>
      <div id="chart-container">
        <canvas ref={chartRef} id="price-chart"></canvas>
      </div>
      {analysisData && (
        <div id="analysis-container">
          <h3>Price Trend Analysis</h3>
          <p><strong>Overall Trend:</strong> {analysisData.trend}</p>
          <p><strong>Price Change:</strong> {analysisData.priceChangePercent}%</p>
          <p><strong>Trend Strength:</strong> {analysisData.trendStrength} ({analysisData.trendDirection})</p>
          <p><strong>Maximum Price:</strong> ${analysisData.max}</p>
          <p><strong>Minimum Price:</strong> ${analysisData.min}</p>
          <p><strong>Average Price:</strong> ${analysisData.average}</p>
          <p><strong>Price Volatility:</strong> {analysisData.volatility}%</p>
        </div>
      )}
    </div>
  );
};

export default History;
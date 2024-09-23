// historyHelpers.ts
interface HistoryData {
    time: string;
    avg: number;
    volume: number;
  }

export function getTimeRangeText(range: string): string {
    switch(range) {
      case 'day': return 'Last 24 Hours';
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'full': return 'All Time';
      default: return '';
    }
  }
  
  export function getTimeUnit(range: string): 'hour' | 'day' | 'month' {
    switch(range) {
      case 'day': return 'hour';
      case 'week': return 'day';
      case 'month': return 'day';
      case 'full': return 'month';
      default: return 'day';
    }
  }
  
  export function calculateMovingAverage(data: HistoryData[], window: number) {
    const movingAverages = [];
    for (let i = window - 1; i < data.length; i++) {
      const windowSlice = data.slice(i - window + 1, i + 1);
      const sum = windowSlice.reduce((acc, item) => acc + item.avg, 0);
      //movingAverages.push({x: new Date(data[i].time), y: sum / window});
      movingAverages.push(sum / window);
    }
    return movingAverages;
  }
  
  export function calculateStatistics(data: HistoryData[]) {
    const prices = data.map(item => item.avg);
    const max = Math.max(...prices).toFixed(2);
    const min = Math.min(...prices).toFixed(2);
    const average = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
  
    const { slope, trend } = calculateLinearRegression(data);
  
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const priceChangePercent = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(2);
  
    return { max, min, average, trend, slope, priceChangePercent };
  }
  
  function calculateLinearRegression(data: HistoryData[]) {
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

  export function calculateVolatility(data: HistoryData[]) {
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
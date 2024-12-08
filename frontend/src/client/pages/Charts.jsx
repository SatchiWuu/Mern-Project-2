import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartData, setChartData] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/order/chart', {
        params: { startDate, endDate },
      });

      // Prepare data for the chart
      const labels = data.map((order) =>
        new Date(order.createdAt).toLocaleDateString()
      );
      const prices = data.map((order) => order.totalPrice);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Total Price',
            data: prices,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
    }
  }, [startDate, endDate]);

  return (
    <div>
      <h2>Order Chart</h2>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true, position: 'top' },
            },
          }}
          style={{ maxHeight: '400px', width: '1200px' }}
        />
      ) : (
        <p>Select a date range to view data.</p>
      )}
    </div>
  );
};

export default Charts;

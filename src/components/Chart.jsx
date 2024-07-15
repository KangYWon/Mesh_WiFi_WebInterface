// src/components/LatencyChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const LatencyChart = ({ data = [] }) => {
  const chartData = {
    labels: Array.from({ length: data.length }, (_, i) => i + 1), // 1부터 데이터 길이까지의 라벨 생성
    datasets: [
      {
        label: 'Latency (ms)',
        data: data,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div>
      
      <Line data={chartData} />
    </div>
  );
};

export default LatencyChart;
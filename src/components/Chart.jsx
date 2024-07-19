// src/components/LatencyChart.jsx
import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const LatencyChart = ({ data = [] }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current;

    if (chartInstance) {
      // 데이터가 업데이트 될 때마다 새로운 데이터를 차트에 추가
      chartInstance.data.labels = Array.from({ length: data.length }, (_, i) => i + 1);
      chartInstance.data.datasets[0].data = data;
      chartInstance.update();
    }
  }, [data]);

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
      {/* <Line data={chartData} /> */}
      <Line ref={chartRef} data={chartData} />
    </div>
  );
};

export default LatencyChart;
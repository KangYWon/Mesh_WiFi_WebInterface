// src/components/LatencyChart.jsx
import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const ThroughputChart = ({ data = [], loss = [] }) => {
  const chartRef = useRef(null);

  const chartData = {
    labels: Array.from({ length: data.length }, (_, i) => (i + 1) * 10), // 10 단위로 라벨 생성
    datasets: [
      {
        label: 'Throughput (Mbps)',
        data: data,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              const lossValue = loss[context.dataIndex] || 0;
              return `${label}: ${context.parsed.y} Mbps \n(Loss: ${lossValue}%)`;
            }
          }
        }
      }
    };
    // plugins: {
    //   tooltip: {
    //     callbacks: {
    //       label: function (context) {
    //         const label = context.dataset.label || '';
    //         return `${label}: ${context.parsed.y} Mbps`;
    //       },
    //       afterLabel: function (context) {
    //         const lossValue = loss[context.dataIndex] || 0;
    //         return `Loss: ${lossValue}%`;
    //       }
    //     }
    //   }
    // }

  useEffect(() => {
    const chartInstance = chartRef.current;

    if (chartInstance) {
      // 데이터가 업데이트 될 때마다 새로운 데이터를 차트에 추가
      chartInstance.data.labels = Array.from({ length: data.length }, (_, i) => (i + 1) * 10);
      chartInstance.data.datasets[0].data = data;
      chartInstance.update();
    }
  }, [data, loss]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default ThroughputChart;
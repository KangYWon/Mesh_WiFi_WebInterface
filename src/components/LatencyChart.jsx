import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const LatencyChart = ({ data = [], backgroundColor = 'rgba(75,192,192,0.4)', borderColor = 'rgba(75,192,192,1)', isError = false, isStop=false}) => {
  // Error 상태에 따라 색상 설정
  const errorBackgroundColor = 'rgba(255,99,132,0.2)'; // 에러 상태 배경색
  const errorBorderColor = 'rgba(255,99,132,1)'; // 에러 상태 테두리색

  const chartData = {
    labels: Array.from({ length: data.length }, (_, i) => i + 1), // 1부터 데이터 길이까지의 라벨 생성
    datasets: [
      {
        label: 'Latency (ms)',
        data: data,
        fill: false,
        backgroundColor: isStop ? errorBackgroundColor : backgroundColor,
        borderColor: isStop ? errorBorderColor : borderColor,
        borderWidth: 2, // 테두리 두께 설정
      },
    ],
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // 컨테이너 크기에 맞게 차트를 조정
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default LatencyChart;
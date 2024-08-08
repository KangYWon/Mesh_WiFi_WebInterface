import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const ThroughputChart = ({ data = [], loss = [], backgroundColor = 'rgba(75,192,192,0.4)', borderColor = 'rgba(75,192,192,1)', isError = false }) => {
  // Error 상태에 따라 색상 설정
  const errorBackgroundColor = 'rgba(255,99,132,0.2)'; // 에러 상태 배경색
  const errorBorderColor = 'rgba(255,99,132,1)'; // 에러 상태 테두리색

  const chartData = {
    labels: Array.from({ length: data.length }, (_, i) => (i + 1) * 10), // 10 단위로 라벨 생성
    datasets: [
      {
        label: 'Throughput (Mbps)',
        data: data,
        fill: false,
        backgroundColor: isError ? errorBackgroundColor : backgroundColor,
        borderColor: isError ? errorBorderColor : borderColor,
      },
    ],
  };

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
            if (isError && errorMessage) {
              return `Error: ${errorMessage}`;
            }
            // 줄 바꿈을 배열로 처리
            return [
              `${label}: ${context.parsed.y} Mbps`,
              `(Loss: ${lossValue}%)`
            ];
          }
        }
      }
    }
  };
  //   plugins: {
  //     tooltip: {
  //       callbacks: {
  //         label: function (context) {
  //           const label = context.dataset.label || '';
  //           const lossValue = loss[context.dataIndex] || 0;
  //           return `${label}: ${context.parsed.y} Mbps`
  //                   `$(Loss: ${lossValue}%)`;
  //         }
  //       }
  //     }
  //   }
  // };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default ThroughputChart;
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LatencyChart from 'src/components/Chart.jsx'; 
import { Typography } from '@mui/material';
import { connectWebSocket, setOnMessageCallback } from 'src/api/webSocket.js';

const LatencyChartPage = () => {
  const [latencyData, setLatencyData] = useState([]);
  const [measurementResult, setMeasurementResult] = useState(null);

  useEffect(() => {
    setOnMessageCallback((message) => {
      if (message.type === 'latency') {
        const data = message.payload.data;
        setLatencyData(data);
        
        // 수신한 데이터의 평균값을 계산하여 설정
        const avg = calculateAverage(data);
        setMeasurementResult({ type: 'Latency', value: avg });
      }
    });

    // const randomData = Array.from({ length: 20 }, () => Math.random() * 100);
    // setLatencyData(randomData);
  }, []);

  // 배열의 평균 계산 함수
  const calculateAverage = (data) => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr, 0);
    return sum / data.length;
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Latency Test Page
      </Typography>

      <Box sx={{ marginTop: 2, padding: 2, border: '1px solid gray' }}>
      <h2>Latency Chart</h2>
        <LatencyChart data={latencyData} />
      </Box>

      {measurementResult && (
        <Box sx={{ marginTop: 2, padding: 2, border: '1px solid gray' }}>
          <Typography variant="h5">Result</Typography>
          <Typography>
            [{measurementResult.type}] : {measurementResult.value.toFixed(2)} ms
          </Typography>
        </Box>
      )}

      {/* <Button
        variant="contained"
        onClick={() => {
          // 재생성 버튼 클릭 시 새로운 랜덤 데이터 생성 및 결과 업데이트
          const randomData = Array.from({ length: 20 }, () => Math.random() * 100);
          setLatencyData(randomData);
          const avg = calculateAverage(randomData);
          setMeasurementResult({ type: 'Latency', value: avg });
        }}
      >
        Generate New Data
      </Button> */}
    </Box>
  );
};

export default LatencyChartPage;
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import LatencyChart from 'src/components/Chart.jsx'; 
import { Typography } from '@mui/material';
import { setOnMessageCallback } from 'src/api/webSocket.js';

const LatencyChartPage = () => {
  const [latencyData, setLatencyData] = useState([]);
  const [measurementResult, setMeasurementResult] = useState(null);

  useEffect(() => {
    setOnMessageCallback((message) => {
      try {
        const { type, data } = message;
        
        if (type === 'latency') {
          const result = data.result;
          setLatencyData(prevData => {
            const updatedData = [...prevData, parseFloat(result)];

            // 최대 20개의 데이터만 유지
            // if (updatedData.length > 20) {
            //   updatedData.splice(0, updatedData.length - 20);
            // }

            // 평균 계산
            const avg = calculateAverage(updatedData);
            setMeasurementResult({ type: 'Latency', value: avg });

            return updatedData;
          });
        } else {
          console.error('Unexpected message type:', type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
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
        <Typography variant="h6">Latency Chart</Typography>
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
    </Box>
  );
};

export default LatencyChartPage;
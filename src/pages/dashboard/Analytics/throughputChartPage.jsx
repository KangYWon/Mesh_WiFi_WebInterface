import React, { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import ThroughputChart from 'src/components/ThroughputChart.jsx'; 
import { Typography } from '@mui/material';
import { setOnMessageCallback } from 'src/api/webSocket.js';

const ThroughputChartPage = () => {
  const [throughputData, setthroughputData] = useState([]);
  const [measurementResult, setMeasurementResult] = useState(null);
  const chartRef = useRef(null); // 레이아웃 업데이트를 위한 ref

  useEffect(() => {
    setOnMessageCallback((message) => {
      try {
        const { type, data } = message;
        
        if (type === 'throughput') {
          const result = data.result;
          setLatencyData(prevData => {
            const updatedData = [...prevData, parseFloat(result)];

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

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Throughput Test Page
      </Typography>

      <Box sx={{ marginTop: 2, padding: 2, border: '1px solid gray' }}>
        <Typography variant="h6">Throughput Chart</Typography>
        <ThroughputChart data={throughputData} />
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

export default ThroughputChartPage;
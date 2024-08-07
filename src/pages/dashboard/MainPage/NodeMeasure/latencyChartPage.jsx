import React from 'react';
import Box from '@mui/material/Box';
import LatencyChart from 'src/components/LatencyChart.jsx'; 
import { Typography } from '@mui/material';

const LatencyChartPage = ({ latencyData, backgroundColor, borderColor, isError = false }) => {

  // 배열의 평균 계산 함수
  const calculateAverage = (data) => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr, 0);
    return sum / data.length;
  };

  const averageLatency = calculateAverage(latencyData);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Latency Test Page
      </Typography>
      
      {isError && (
        <Typography variant="body1" color="error" sx={{ marginBottom: 2 }}>
          ※ Topology에 변경이 생겼습니다. ※
        </Typography>
      )}

      <Box sx={{ marginTop: 2, padding: 2, border: '1px solid gray', background: '#f9f9f9'}}>
        <Typography variant="h6">Latency Chart</Typography>
        <LatencyChart 
          data={latencyData} 
          backgroundColor={backgroundColor} 
          borderColor={borderColor}
        />
      </Box>

      <Box sx={{ marginTop: 2, padding: 2, border: '1px solid gray' }}>
        <Typography variant="h5">Result</Typography>
        <Typography>
          [Latency] : {averageLatency.toFixed(2)} ms
        </Typography>
      </Box>
    </Box>
  );
};


export default LatencyChartPage;
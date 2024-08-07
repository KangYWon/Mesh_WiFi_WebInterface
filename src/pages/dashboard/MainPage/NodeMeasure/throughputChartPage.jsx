import React from 'react';
import Box from '@mui/material/Box';
import ThroughputChart from 'src/components/ThroughputChart.jsx'; 
import { Typography } from '@mui/material';

const ThroughputChartPage = ({ throughputData, lossData, backgroundColor, borderColor, isError = false }) => {

  // 소수점 네 자리까지 포맷하는 함수
  const formatNumber = (num) => parseFloat(num).toFixed(4);

  return (
    <Box sx={{ padding: '15px' }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 0 }}>
        Throughput Test Page
      </Typography>

      {isError && (
         <Typography variant="body1" color="error" sx={{ marginBottom: 0 }}>
          ※ Topology에 변경이 생겼습니다. ※
        </Typography>
      )}

      <Box sx={{ marginTop: 1.5, padding: 2, border: '1px solid gray', background: '#f9f9f9' }}>
        <Typography variant="h6">Throughput Chart</Typography>
        <ThroughputChart 
          data={throughputData.map(formatNumber)} // 데이터 포맷 적용
          loss={lossData.map(formatNumber)} // 데이터 포맷 적용
          backgroundColor={backgroundColor}
          borderColor={borderColor}
        />
      </Box>
    </Box>
  );
};

export default ThroughputChartPage;


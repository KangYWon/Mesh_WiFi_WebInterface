import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import { sendMessage } from '/src/api/webSocket'; // WebSocket 메시지 전송 함수 가져오기
import Latency from './Latency';
import Throughput from './Throughput';
import LatencyChartPage from './latencyChartPage';

const AnalyticsPage = () => {
  //const [nodes, setNodes] = useState(Array.from({ length: 10 }, (_, index) => ({ id: index, label: `Node ${index}`, coordinates: [36.1, 129.4], layer: Math.floor(Math.random() * 3) + 1 })));
  const [nodes, setNodes] = useState(Array.from({ length: 10 }, (_, index) => ({
    id: index,
    label: `Node ${index}`, // 1부터 시작하도록 수정
    coordinates: [36.1, 129.4],
    layer: Math.floor(Math.random() * 3) + 1
  })));
  const [throughputResults, setThroughputResults] = useState(Array.from({ length: 10 }, () => Array.from({ length: 7 }, () => '-')));
  const [latencyResults, setLatencyResults] = useState(Array.from({ length: 10 }, () => Array.from({ length: 7 }, () => '-')));
  const [error, setError] = useState('');

 
  const tableStyle = {
    minHeight: '300px',
  };

  const cellStyle = {
    fontSize: '0.840rem',
    textAlign: 'center',
    border: '1px solid rgba(224, 224, 224, 1)',
    position: 'relative', // 위치 지정을 위해 필요
    backgroundColor: '#fff', // 기본 배경색 설정
  };

  const layerColors = {
    1: 'red',
    2: 'green',
    3: 'blue',
  };

  return (
    <Container maxWidth="lg" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '30px' }}>
        Analytics
      </Typography>
      <Grid container spacing={4} direction="column">
        <Grid item xs={12}>
          <Latency/>
        </Grid>
        <Grid item xs={12}>
          <Throughput/>
        </Grid>
        <Grid item xs={12}>
          <LatencyChartPage/>
        </Grid>
      </Grid>
    </Container>
  );  
  
};

export default AnalyticsPage;

import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import { sendMessage } from '/src/api/webSocket'; // WebSocket 메시지 전송 함수 가져오기

const AnalyticsPage = () => {
  //const [nodes, setNodes] = useState(Array.from({ length: 10 }, (_, index) => ({ id: index, label: `Node ${index}`, coordinates: [36.1, 129.4], layer: Math.floor(Math.random() * 3) + 1 })));
  const [nodes, setNodes] = useState(Array.from({ length: 10 }, (_, index) => ({
    id: index,
    label: `Node ${index + 1}`, // 1부터 시작하도록 수정
    coordinates: [36.1, 129.4],
    layer: Math.floor(Math.random() * 3) + 1
  })));
  const [throughputResults, setThroughputResults] = useState(Array.from({ length: 10 }, () => Array.from({ length: 7 }, () => '-')));
  const [latencyResults, setLatencyResults] = useState(Array.from({ length: 10 }, () => Array.from({ length: 7 }, () => '-')));
  const [error, setError] = useState('');

  useEffect(() => {
    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);
      const { type, payload } = message;
      
      if (type === 'measurementData') {
        const { nodes, throughputResults, latencyResults, connections } = payload;
        setNodes(nodes);
        setThroughputResults(throughputResults);
        setLatencyResults(latencyResults);
      }
    };
    // WebSocket 메시지 이벤트 리스너 등록
    const ws = new WebSocket('ws://203.252.121.251:3000/web_interface_handler');
    ws.onmessage = handleWebSocketMessage;

    // 컴포넌트가 unmount될 때 WebSocket 연결 종료
    return () => {
      ws.close();
    };
  }, []); // 빈 배열을 넘겨 한 번만 실행되도록 설정

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
          <Paper elevation={3} style={{ padding: '20px', ...tableStyle }}>
            <Typography variant="h6" gutterBottom align="center">
              Throughput 측정 결과
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={cellStyle}></TableCell>
                  {nodes.map(node => (
                    <TableCell key={node.id} sx={cellStyle}>
                      {node.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {nodes.map((node, rowIndex) => (
                  <TableRow key={node.id}>
                    <TableCell sx={cellStyle}>
                      {node.label}
                    </TableCell>
                    {nodes.map((_, colIndex) => (
                      <TableCell key={colIndex} sx={cellStyle}>
                        {throughputResults[rowIndex][colIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px', ...tableStyle }}>
            <Typography variant="h6" gutterBottom align="center">
              Latency 측정 결과
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={cellStyle}></TableCell>
                  {nodes.map(node => (
                    <TableCell key={node.id} sx={cellStyle}>
                      {node.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {nodes.map((node, rowIndex) => (
                  <TableRow key={node.id}>
                    <TableCell sx={cellStyle}>
                      {node.label}
                    </TableCell>
                    {nodes.map((_, colIndex) => (
                      <TableCell key={colIndex} sx={cellStyle}>
                        {latencyResults[rowIndex][colIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );  
  
};

export default AnalyticsPage;

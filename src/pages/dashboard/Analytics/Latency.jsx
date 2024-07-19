import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';

const Latency = () => { 
  const [nodes, setNodes] = useState([]);
  const [latencyResults, setLatencyResults] = useState([]);

  useEffect(() => {
    console.log('Nodes:', nodes); // 디버깅 로그
  
    const handleWebSocketMessage = (message) => {
      console.log('WebSocket Message:', message);

      if (message.type === 'fetch_latency') {
        const latencyDataFromServer = message.data;
        console.log('Fetched Data:', latencyDataFromServer); // 디버깅 로그

        if (Array.isArray(latencyDataFromServer)){
          // Initialize latnecy results array
          const initialLatencyResults = Array(nodes.length).fill().map(() => Array(nodes.length).fill('-'));
          
          // Populate latnecy results based on fetched data
          latencyDataFromServer.forEach (data => {
            const { source_seq, destination_seq, result } = data;
            if (source_seq < nodes.length && destination_seq < nodes.length) {
              initialLatencyResults[source_seq][destination_seq] = `${result.toFixed(2)} ms`;
            }
          });
          // Setting latnecy results in state
          setLatencyResults(initialLatencyResults);
        } else {
          console.error('Invalid or empty data received for throughput.');
        }
      } else if (message.type === 'fetch_node') {
        const nodeDataFromServer = message.data;
        console.log('Fetched Node Data:', nodeDataFromServer); // 받은 노드 데이터 확인

        if (Array.isArray(nodeDataFromServer)) {
          setNodes(nodeDataFromServer);
        } else {
          console.error('Invalid or empty data received for nodes.');
        }
      }
    };

    // WebSocket 메시지 콜백 설정
    setOnMessageCallback(handleWebSocketMessage);
    sendMessage('fetch_latency', { type: 'fetch_latency' });

    // Clean up on unmount
    return () => {
      setOnMessageCallback(null);
    };
  }, [nodes]); 

  const tableStyle = {
    minHeight: '300px',
  };

  const cellStyle = {
    fontSize: '0.840rem',
    textAlign: 'center',
    border: '1px solid rgba(224, 224, 224, 1)',
    position: 'relative',
    backgroundColor: '#fff',
  };

  const getBackgroundColor = (source_seq, destination_seq) => {
    if (source_seq === destination_seq) {
      return ''; // 자기 자신인 경우 색상 없음
    } else if (source_seq < destination_seq && latencyResults[source_seq]?.[destination_seq] !== '-') {
      return 'rgba(255, 255, 0, 0.1)'; // 대각선 위의 부분에 노란색 적용
    } else {
      return ''; // 대각선 아래의 부분에는 색상 없음
    }
    /**
     * else if (source < destination && latencyResults[source][destination] !== '-') {
      return 'rgba(255, 255, 0, 0.1)'; // 대각선 위의 부분에 노란색 적용
    } else if (source > destination && latencyResults[destination][source] !== '-') {
      return 'rgba(255, 255, 0, 0.1)'; // 대각선 위의 부분에 노란색 적용
     */
  };

  return (
    <Grid item xs={12}>
      <Paper elevation={3} style={{ padding: '20px', ...tableStyle, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', fontSize: '1.0rem' }} >
          Latency 측정 결과
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={cellStyle}></TableCell>
              {nodes.map((node, index) => (
                <TableCell key={index} sx={cellStyle}>
                  Node {node.seq}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {nodes.map((node, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell sx={cellStyle}>
                  Node {node.seq}
                </TableCell>
                {nodes.map((_, colIndex) => {
                  const resultCell = latencyResults[rowIndex]?.[colIndex];
                  return (
                    <TableCell key={colIndex} sx={{ ...cellStyle, backgroundColor: getBackgroundColor(rowIndex, colIndex) }}>
                      {resultCell !== '-' && resultCell ? (
                        <span>
                          {`${resultCell}`}
                        </span>
                      ) : '-'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="body2" sx={{ alignSelf: 'flex-end', marginTop: 'auto' }}>
          ※Latency표 측정값은 20개 평균 값이다.※
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Latency;
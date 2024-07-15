import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { setOnMessageCallback } from 'src/api/webSocket.js';

const Latency = ({ nodes = [] }) => { // nodes에 기본값을 임의의 데이터로 설정
  const [latencyResults, setLatencyResults] = useState([]);

  useEffect(() => {
    console.log('Nodes:', nodes); // 디버깅 로그
    // 노드 데이터가 있을 때만 실행
    // if (nodes.length > 0) {
    //   // Simulating data fetching from server
    //   const fetchLatencyData = async () => {
    //     try {
    //       // Simulating data received from server
    //       const latencyDataFromServer = [
    //         [0, 1, 30],   // Latency results for Node 0 to Node 1
    //         [1, 2, 35],   // Latency results for Node 1 to Node 2
    //         [2, 3, 38],   // Latency results for Node 0 to Node 2
    //       ];
    //       console.log('Fetched Latency Data:', latencyDataFromServer); // 디버깅 로그

    //       // Initialize latency results array
    //       const initialLatencyResults = Array(nodes.length).fill().map(() => Array(nodes.length).fill('-'));

    //       // Populate latency results based on fetched data
    //       latencyDataFromServer.forEach(([source, destination, result]) => {
    //         initialLatencyResults[source][destination] = result;
    //         initialLatencyResults[destination][source] = result; // 반대 방향도 동일한 값 설정
    //       });

    //       // Setting latency results in state
    //       setLatencyResults(initialLatencyResults);
    //     } catch (error) {
    //       console.error('Error fetching latency data:', error);
    //     }
    //   };

    //   // Call fetchLatencyData when nodes are available
    //   fetchLatencyData();
    // }
    const handleWebSocketMessage = (message) => {
      if (message.type === 'fetch_latency') {
        //const latencyDataFromServer = message.payload;
        console.log('Fetched Data:', latencyDataFromServer); // 디버깅 로그

        // Initialize latnecy results array
        const initialLatencyResults = Array(nodes.length).fill().map(() => Array(nodes.length).fill('-'));

        // Populate latnecy results based on fetched data
        latencyDataFromServer.forEach(([source, destination, result, packetLoss]) => {
            initialLatencyResults[source][destination] = result;
            initialLatencyResults[destination][source] = result; // 반대 방향도 동일한 값 설정
          });

        // Setting latnecy results in state
        setLatencyResults(initialLatencyResults);
      }
    };

    // WebSocket 메시지 콜백 설정
    setOnMessageCallback(handleWebSocketMessage);

    // Clean up on unmount
    return () => {
      setOnMessageCallback(null);
    };
  }, [nodes]); // nodes가 변경될 때마다 실행

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

  const getBackgroundColor = (source, destination) => {
    if (source === destination) {
      return ''; // 자기 자신인 경우 색상 없음
    } else if (source < destination && latencyResults[source]?.[destination] !== '-') {
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
      <Paper elevation={3} style={{ padding: '20px', ...tableStyle }}>
        <Typography variant="h6" gutterBottom align="center">
          Latency 측정 결과
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={cellStyle}></TableCell>
              {nodes.map((node) => (
                <TableCell key={node.seq} sx={cellStyle}>
                  Node {node.seq}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {nodes.map((node, rowIndex) => (
              <TableRow key={node.seq}>
                <TableCell sx={cellStyle}>
                  Node {node.seq}
                </TableCell>
                {nodes.map((_, colIndex) => (
                  <TableCell key={colIndex} sx={{ ...cellStyle, backgroundColor: getBackgroundColor(rowIndex, colIndex) }}>
                    {latencyResults[rowIndex] && latencyResults[rowIndex][colIndex] !== '-' 
                      ? `${latencyResults[rowIndex][colIndex]} ms` 
                      : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  );
};

export default Latency;
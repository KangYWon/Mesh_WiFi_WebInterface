import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { setOnMessageCallback } from 'src/api/webSocket.js';

const Throughput = ({ nodes = [] }) => {
  const [throughputResults, setThroughputResults] = useState([]);

  useEffect(() => {
    console.log('Nodes:', nodes); // 디버깅 로그
    // 노드 데이터가 있을 때만 실행
    // if (nodes.length > 0) {
    //     const fetchThroughputData = async () => {
    //         try {
    //           // Simulating data received from server
    //           const throughputDataFromServer = [
    //             [0, 2, 100, 2],
    //             [1, 2, 400, 0.1],
    //             [2, 3, 50, 0.3],
    //           ];
      
    //           // Initialize latency results array
    //           const initialThroughputResults = Array(nodes.length).fill().map(() => Array(nodes.length).fill('-'));
      
    //           // Populate latency results based on fetched data
    //           throughputDataFromServer.forEach(([source, destination, result, packetLoss]) => {
    //               initialThroughputResults[source][destination] = { result: `${result} Mbps`, packetLoss: `${packetLoss}% loss` };
    //               initialThroughputResults[destination][source] = { result: `${result} Mbps`, packetLoss: `${packetLoss}% loss` }; // 반대 방향도 동일한 값 설정
    //             });
      
    //           // Setting throughput results in state
    //           setThroughputResults(initialThroughputResults);
    //         } catch (error) {
    //           console.error('Error fetching throughput data:', error);
    //         }
    //       };
          
    //       // Call fetchThroughputData when component mounts
    //       fetchThroughputData();
    // }
    // Simulating data fetching from server
    const handleWebSocketMessage = (message) => {
        if (message.type === 'fetch_throughput') {
          const throughputDataFromServer = message.payload;
          console.log('Fetched Data:', throughputDataFromServer); // 디버깅 로그
  
          if (Array.isArray(throughputDataFromServer)) {
            // Initialize throughput results array
            const initialThroughputResults = Array(nodes.length).fill().map(() => Array(nodes.length).fill('-'));

            // Populate throughput results based on fetched data
            throughputDataFromServer.forEach(([source_seq, destination_seq, result, loss]) => {
                if (source_seq < nodes.length && destination_seq < nodes.length) {
                    initialThroughputResults[source_seq][destination_seq] = { result: `${result} Mbps`, packetLoss: `${loss}% loss` };
                    initialThroughputResults[destination_seq][source_seq] = { result: `${result} Mbps`, packetLoss: `${loss}% loss` }; // 반대 방향도 동일한 값 설정
                }
            });

            // Setting throughput results in state
            setThroughputResults(initialThroughputResults);
        } else {
            console.error('Invalid or empty data received for throughput.');
        }
      }
    };
  
      // WebSocket 메시지 콜백 설정
      setOnMessageCallback(handleWebSocketMessage);
  
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
    } else if (source_seq < destination_seq && throughputResults[source_seq]?.[destination_seq] !== '-' && throughputResults[source_seq]?.[destination_seq] !== undefined) {
      return 'rgba(255, 255, 0, 0.1)'; // 대각선 위의 부분에 값이 있는 경우에만 노란색 적용
    } else {
      return ''; // 대각선 아래의 부분이나 값이 없는 경우 색상 없음
    }
  };
  
  return (
    <Grid item xs={12}>
      <Paper elevation={3} style={{ padding: '20px', ...tableStyle }}>
        <Typography variant="h6" gutterBottom align="center">
          Throughput 측정 결과
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
                {nodes.map((_, colIndex) => {
                  const resultCell = throughputResults[rowIndex]?.[colIndex];
                  return (
                    <TableCell key={colIndex} sx={{ ...cellStyle, backgroundColor: getBackgroundColor(rowIndex, colIndex) }}>
                        {resultCell !== '-' && resultCell ? (
                            <span>
                                {`${resultCell.result}`} <br/>
                                {`${resultCell.packetLoss}`}
                            </span>
                            ) : '-'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  );
};

export default Throughput;
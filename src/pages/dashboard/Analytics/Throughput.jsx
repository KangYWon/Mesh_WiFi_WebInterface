import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';

//fetch_node
const Throughput = () => {
  const [nodes, setNodes] = useState([]);
  const [throughputResults, setThroughputResults] = useState([]);

  useEffect(() => {
    console.log('Nodes:', nodes); // 디버깅 로그

    const handleWebSocketMessage = (message) => {
      console.log('WebSocket Message:', message); // WebSocket 메시지 확인

      if (message.type === 'fetch_node') {
        const nodeDataFromServer = message.data;
        console.log('Fetched Node:', nodeDataFromServer); // 받은 데이터 확인
        setNodes(nodeDataFromServer);
      } 
    };

    // WebSocket 메시지 콜백 설정
    setOnMessageCallback(handleWebSocketMessage);
    // 초기 메시지 전송
    sendMessage('fetch_node', { type: 'fetch_node' });
    // const sendMessageWithDelayNode = () => {
    //   sendMessage('fetch_node', { type: 'fetch_node' });
    //   setTimeout(() => {
    //     sendMessageWithDelay();
    //   }, 1000); // 5초 텀
    // };
    // sendMessageWithDelayNode();
    // Clean up on unmount
    return () => {
      setOnMessageCallback(null);
    };
  }, []);

  //fetch_throughput
  useEffect(() => {
    const handleWebSocketMessage = (message) => {
      console.log('WebSocket Message:', message); // WebSocket 메시지 확인

      if (message.type === 'fetch_throughput') {
        const throughputDataFromServer = message.data;
        console.log('Fetched Data:', throughputDataFromServer); // 받은 데이터 확인

        if (Array.isArray(throughputDataFromServer)) {
          // Initialize throughput results array
          const initialThroughputResults = Array(nodes.length).fill().map(() => Array(nodes.length).fill('-'));

          // Populate throughput results based on fetched data
          throughputDataFromServer.forEach(data => {
            const { source_seq, destination_seq, result, loss } = data;
            if (source_seq < nodes.length && destination_seq < nodes.length) {
              initialThroughputResults[source_seq][destination_seq] = { result: `${result.toFixed(2)} Mbps`, loss: `${loss.toFixed(1)}% loss` };
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
    // nodes가 업데이트될 때만 throughput 요청
    // const sendMessageWithDelay = () => {
    //   sendMessage('fetch_throughput', { type: 'fetch_throughput' });
    //   setTimeout(() => {
    //     sendMessageWithDelay();
    //   }, 1000); // 5초 텀
    // };
    if (nodes.length > 0) {
      sendMessage('fetch_throughput', { type: 'fetch_throughput' });
      //sendMessageWithDelay();
    }
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
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', fontSize: '1.0rem' }} >
          Throughput 측정 결과
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
                  const resultCell = throughputResults[rowIndex]?.[colIndex];
                  return (
                    <TableCell key={colIndex} sx={{ ...cellStyle, backgroundColor: getBackgroundColor(rowIndex, colIndex) }}>
                      {resultCell !== '-' && resultCell ? (
                        <span>
                          {`${resultCell.result}`} <br/>
                          {`${resultCell.loss}`}
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
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';


export default function NodeMeasurement() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [measurementResult, setMeasurementResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 웹소켓 연결 설정 및 메시지 처리
    setOnMessageCallback((message) => {
        const { type, value } = message;
        const unit = type === 'latency' ? 'ms' : 'Mbps';
        setMeasurementResult({ type, value: `${value} ${unit}` });
      });

    // return () => {
    //   // 컴포넌트가 언마운트될 때 웹소켓 연결 해제
    //   // 웹소켓 연결 해제 코드 (필요시 추가)
    // };
  }, [source, destination]); // sourceNode, destinationNode가 변경될 때마다 연결을 재설정

  const handleMeasurement = (type) => {
    sendMessage(type.toLowerCase(), { source, destination })
      .then(response => {
        // 웹소켓 응답 처리 (예시)
        const { type, value } = response;
        const unit = type === 'latency' ? 'ms' : 'Mbps';
        setMeasurementResult({ type, value: `${value} ${unit}` });
      })
      .catch(error => {
        console.error('Error sending WebSocket message:', error);
      });
    // 서버로 요청 보내는 로직 (예: fetch API 사용)
    // 예시: 서버에서 받은 결과로 measurementResult 업데이트
    // const result = { type, value: `${Math.random() * 100} ms` };
    // setMeasurementResult(result);
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ccc', paddingLeft: '16px' }}>
      <h2>Node Measurement</h2>
      <TextField
        label="Source Node"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Destination Node"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button variant="contained" sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }} 
          onClick={() => handleMeasurement('Throughput')}>
          Throughput
        </Button>
        <Button variant="contained" sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }}
          onClick={() => handleMeasurement('Latency')}>
          Latency
        </Button>
      </Box>

      {measurementResult && (
        <Box sx={{ marginTop: 2, padding: 2, border: '1px solid gray' }}>
          <h3>[ Result ] </h3>
          <p>
            Source Node [{source}] ➔ Destination Node [{destination}]
          </p>
          <p>
            [{measurementResult.type}] : {measurementResult.value}
          </p>
        </Box>
      )}

      <Button
        variant="outlined"
        sx={{ 
          marginTop: 2,
          borderColor: 'green', 
          color: 'green', 
          '&:hover': {
            borderColor: 'darkgreen',
            color: 'darkgreen',
          }
        }}
        onClick={() => navigate('/analytics')}
      >
        Go to the Analytics
      </Button>
    </Box>
  );
}
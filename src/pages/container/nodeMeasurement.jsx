import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LatencyChartPage  from 'src/pages/dashboard/Analytics/latencyChartPage.jsx';
import { useNavigate } from 'react-router-dom';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';

export default function NodeMeasurement({ nodes = [] }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [measurementResult, setMeasurementResult] = useState(null);
  const [latencyData, setLatencyData] = useState([]);
  const [currentMeasurementType, setCurrentMeasurementType] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // 웹소켓 연결 설정 및 메시지 처리
    setOnMessageCallback((message) => {
        const { type, value } = message;
        const unit = type === 'latency' ? 'ms' : 'Mbps';
        setMeasurementResult({ type, value: `${value} ${unit}` });

    });
  }, []); // 빈 배열로 설정하여 컴포넌트가 처음 마운트될 때만 실행
  //}, [source, destination]); // sourceNode, destinationNode가 변경될 때마다 연결을 재설정

  const isNodeSeqValid = (value, nodes) => {
    const nodeSeqs = nodes.map(node => node.seq);
    return nodeSeqs.includes(parseInt(value));
  };

  const handleMeasurement = (type) => {
    // 입력값 유효성 검사
    if (!source.trim() || !destination.trim()) {
      setError('Source and Destination cannot be empty');
      return;
    } else if (source.trim() === destination.trim()) {
      setError('Source and Destination should be different nodes');
      return;
    // } else if (!isNodeSeqValid(source, nodes) || !isNodeSeqValid(destination, nodes)) {
    //   setError('Source and Destination should be valid node sequences');
    //   return;
     } else {
      setError('');
    }
    
    setCurrentMeasurementType(type); // 측정 유형 설정
    sendMessage(type.toLowerCase(), { source, destination })
      .then(response => {
        // 웹소켓 응답 처리 (예시)
        const { type, value } = response;
        const unit = type === 'latency' ? 'ms' : 'Mbps';
        setMeasurementResult({ type, value: `${value} ${unit}` });

        if (type === 'latency') {
          setLatencyData(prevData => [...prevData, parseFloat(value)]);
        }
      })
      .catch(error => {
        console.error('Error sending WebSocket message:', error);
      });
  };

  // const handleReset = () => {
  //   setSource('');
  //   setDestination('');
  //   setMeasurementResult(null);
  //   setLatencyData([]);
  //   setCurrentMeasurementType(null);
  //   setError('');
  // };
  const handleClearInputs = () => {
    setSource('');
    setDestination('');
    setError('');
  };

  const handleClearResults = () => {
    setMeasurementResult(null);
    setLatencyData([]);
    setCurrentMeasurementType(null);
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ccc', borderBottom: '1px solid #ccc', paddingLeft: '16px' }}>
      <h2>Node Measurement</h2>
      <TextField
        label="Source Node"
        value={source}
        onChange={(e) => {
          setSource(e.target.value);
          setError('');
        }}
        fullWidth
        margin="normal"
        error={!!error}
        helperText={error}
      />
      <TextField
        label="Destination Node"
        value={destination}
        onChange={(e) => {
          setDestination(e.target.value);
          setError('');
        }}
        fullWidth
        margin="normal"
        error={!!error}
        helperText={error}
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
          {currentMeasurementType === 'Latency' ? (
            <>
              {/* <LatencyChart data={latencyData} />
              <p>[{measurementResult.type}] : {measurementResult.value.avg}</p> */}
              <LatencyChartPage />
            </>
          ) : (
            <p>[{measurementResult.type}] : {measurementResult.value}</p>
          )}
        </Box>
      )}

      {(source || destination) && (
        <Button
          variant="outlined"
          sx={{
            marginTop: 2,
            color: 'black',
            border: '1px solid black',
            '&:hover': {
              backgroundColor: 'white',
              border: '1px solid blue',
            },
          }}
          onClick={handleClearInputs}
        >
          Clear Inputs
        </Button>
      )}

      {measurementResult && (
        <Button
          variant="outlined"
          sx={{
            marginTop: 2,
            color: 'black',
            border: '1px solid black',
            '&:hover': {
              backgroundColor: 'white',
              border: '1px solid blue',
            },
          }}
          onClick={handleClearResults}
        >
          Clear Results
        </Button>
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
          },
        }}
        onClick={() => navigate('/analytics')}
      >
        Go to the Analytics
      </Button>
    </Box>
  );
}
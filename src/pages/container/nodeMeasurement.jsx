import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LatencyChartPage  from 'src/pages/dashboard/Analytics/latencyChartPage.jsx';
import { useNavigate } from 'react-router-dom';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';

export default function NodeMeasurement({ }) {
  const [nodes, setNodes] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [measurementResult, setMeasurementResult] = useState(null);
  const [currentMeasurementType, setCurrentMeasurementType] = useState(null);
  const [measurementRequested, setMeasurementRequested] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  //clear result의 경우 서버쪽으로 send 그만 정보 보내라는 요청으로 로직 고민해보기. 

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
    return () => {
      setOnMessageCallback(null);
    };
  }, []);

  useEffect(() => {
    setOnMessageCallback((message) => {
      try {
        const { type, data } = message;

        if (measurementRequested) { // 측정 요청이 있을 때만 결과 처리
          if (type === 'latency') {
            const { result } = data;
            // latency 데이터 업데이트
            setMeasurementResult({ type: 'Latency', value: result });
          } else if (type === 'throughput') {
            const { result, loss } = data;
            // throughput 데이터 업데이트
            setMeasurementResult({ 
              type: 'Throughput', 
              result: `${result.toFixed(2)} Mbps`, 
              loss: `${loss.toFixed(1)}% loss` 
            });
          } else {
            console.error('Unexpected message type:', type);
          }
          setMeasurementRequested(false); // 결과 처리 후 다시 false로 설정
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
  }, [measurementRequested]); // measurementRequested를 의존성 배열에 추가

  const handleMeasurement = (type) => {
    // 입력값 유효성 검사
    if (!source.trim() || !destination.trim()) {
      setError('Source and Destination cannot be empty');
      return;
    } else if (source.trim() === destination.trim()) {
      setError('Source and Destination should be different nodes');
      return;
    } else if (!isNodeSeqValid(parseInt(source), nodes) || !isNodeSeqValid(parseInt(destination), nodes)) {
      setError('Source and Destination should be valid node sequences');
      return;
    } else {
    setError('');
    } 
    setCurrentMeasurementType(type); // 측정 유형 설정
    setMeasurementRequested(true); // 측정 요청 상태를 true로 설정

    sendMessage(type.toLowerCase(), { source, destination })
      .catch(error => {
        console.error('Error sending WebSocket message:', error);
        setMeasurementRequested(false); // 에러 발생 시 false로 재설정
      });
  };

  const isNodeSeqValid = (value, nodes) => {
    return value >= 0 && value < nodes.length;
  };

  const handleClearInputs = () => {
    setSource('');
    setDestination('');
    setError('');
  };

  const handleClearResults = () => {
    setMeasurementResult(null);
    setCurrentMeasurementType(null);
    setSource('');
    setDestination('');
    setError('');
    setMeasurementRequested(false); // 결과 삭제 시 측정 요청 상태도 초기화
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '16px' }}>
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
        disabled={!!measurementResult} // 결과가 있으면 비활성화
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
        disabled={!!measurementResult} // 결과가 있으면 비활성화
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
            <LatencyChartPage latencyData={measurementResult.value} />
          ) : (
            <p>[{measurementResult.type}] : {measurementResult.result} ({measurementResult.loss})</p>
          )}
        </Box>
      )}

      {(source || destination) && !measurementResult && (
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
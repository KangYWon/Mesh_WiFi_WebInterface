import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import LatencyChartPage  from 'src/pages/dashboard/MainPage/NodeMeasure/latencyChartPage.jsx';
import ThroughputChartPage from 'src/pages/dashboard/MainPage/NodeMeasure/throughputChartPage.jsx';

import { useNavigate } from 'react-router-dom';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';
import { textFieldStyles, buttonStyles, clearButtonStyles, analyticsButtonStyles } from 'src/components/styles.js';

export default function NodeMeasurement({ }) {
  const [nodes, setNodes] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [measurementResult, setMeasurementResult] = useState(null);
  const [currentMeasurementType, setCurrentMeasurementType] = useState(null);
  const [measurementRequested, setMeasurementRequested] = useState(false);
  const [error, setError] = useState('');
  const [resultPage, setResultPage] = useState(false); // 현재 페이지가 결과 페이지인지 상태
  const [buttonDisabled, setButtonDisabled] = useState(false); // 버튼 비활성화 상태
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Nodes:', nodes); // 디버깅 로그

    const handleWebSocketMessage = (message) => {
      console.log('WebSocket Message:', message); // WebSocket 메시지 확인

      if (message.type === 'fetch_node') {
        const nodeDataFromServer = message.data;
        console.log('Fetched Node:', nodeDataFromServer); // 받은 데이터 확인
        setNodes(nodeDataFromServer);
      
      } else if (message.type === 'latency' || message.type === 'throughput') {
        setResultPage(true); // 결과 페이지로 상태 변경
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
              result: result, 
              loss: loss
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
    setButtonDisabled(true); // 버튼 비활성화 상태 설정

    sendMessage(type.toLowerCase(), { source, destination })
      .catch(error => {
        console.error('Error sending WebSocket message:', error);
        setMeasurementRequested(false); // 에러 발생 시 false로 재설정
      });
      // 10초 후 버튼을 다시 활성화
    setTimeout(() => {
      setButtonDisabled(false);
    }, 10000);
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
    setMeasurementRequested(false);
    setResultPage(false);
  };

  const handleStopMeasurement = async () => {
  //   if (resultPage) {
  //     try {
  //       await sendMessage('cancel_measurement', { type: 'cancel_measurement', source: source, destination: destination });
  //       console.log('Measurement stopped.');
  //     } catch (error) {
  //       console.error('Error stopping measurement:', error);
  //     }
  //   }
  // };
    try {
      await sendMessage('cancel_measurement', { type: 'cancel_measurement', source: source, destination: destination });
      console.log('Measurement stopped.');
      setMeasurementResult(null);
      setCurrentMeasurementType(null);
      setMeasurementRequested(false);
      setResultPage(false); // 결과 페이지 상태 초기화
    } catch (error) {
      console.error('Error stopping measurement:', error);
    }
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
        sx={textFieldStyles}
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
        disabled={!!measurementResult} 
        sx={textFieldStyles}
        ></TextField>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button
          variant="contained"
          sx={buttonStyles}
          onClick={() => handleMeasurement('Throughput')}
          disabled={buttonDisabled} // 버튼 비활성화 상태 설정
        >
          Throughput
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles}
          onClick={() => handleMeasurement('Latency')}
          disabled={buttonDisabled} // 버튼 비활성화 상태 설정
        >
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
            <ThroughputChartPage throughputData={measurementResult} />
          )}
        </Box>
      )}

      {measurementResult && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, width: '100%' }}>
          <Button
            variant="outlined"
            sx={{ ...clearButtonStyles, flex: 1, margin: '0 4px' }}
            onClick={handleClearResults}
          >
            Clear Results
          </Button>
          <Button
            variant="outlined"
            sx={{ ...clearButtonStyles, flex: 1, margin: '0 4px' }}
            onClick={handleStopMeasurement}
          >
            Stop Measurement
          </Button>
        </Box>
      )}

      {(source || destination) && !measurementResult && (
        <Button
          variant="outlined"
          sx={clearButtonStyles}
          onClick={handleClearInputs}
        >
          Clear Inputs
        </Button>
      )}

      <Button
        variant="outlined"
        sx={analyticsButtonStyles}
        onClick={() => navigate('/analytics')}
      >
        Go to the Analytics
      </Button>
    </Box>
  );
}
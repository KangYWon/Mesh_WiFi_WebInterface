import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import LatencyChartPage  from 'src/pages/dashboard/MainPage/NodeMeasure/latencyChartPage.jsx';
import ThroughputChartPage from 'src/pages/dashboard/MainPage/NodeMeasure/throughputChartPage.jsx';

import { useNavigate } from 'react-router-dom';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';
import {
  textFieldStyles,
  buttonStyles,
  clearButtonStyles,
  analyticsButtonStyles,
  stopButtonStyles,
  activeStopButtonStyles,
} from 'src/components/styles.js';

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
  const [latencyData, setLatencyData] = useState([]); // Latency 데이터를 저장할 상태
  const [throughputData, setThroughputData] = useState({ result: [], loss: [] }); // Throughput 
  const [isStopMeasurementClicked, setIsStopMeasurementClicked] = useState(false);

  const [isError, setIsError] = useState(false); // 에러 상태를 관리하는 상태
  const [isActive, setIsActive] = useState({ clear: false, stop: false }); // 버튼 활성화 상태
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Nodes:', nodes); // 디버깅 로그

    const handleWebSocketMessage = (message) => {
      console.log('WebSocket Message:', message); // WebSocket 메시지 확인

      if (message.type === 'fetch_node') {
        const nodeDataFromServer = message.data;
        console.log('Fetched Node:', nodeDataFromServer); // 받은 데이터 확인
        setNodes(nodeDataFromServer);

        // if (!resultPage) {  // resultPage가 false인 경우에만 에러를 표시
        //   setError('Network topology has changed. Measurement is temporarily disabled.');
        //   setButtonDisabled(true); // 버튼 비활성화 상태 설정
        //   setTimeout(() => {
        //     setButtonDisabled(false); // 5초 후 버튼 다시 활성화
        //     setError('');
        //   }, 3000);
        // }
      } else if (message.type === 'latency') {
        if (message.data && message.data.result != null) {
          setLatencyData(prevData => [...prevData, parseFloat(message.data.result)]);
          setMeasurementResult({ type: 'Latency', value: parseFloat(message.data.result) });
          setResultPage(true); // 결과 페이지로 상태 변경
          setIsError(false); // 에러 상태 해제
        } else {
          setError('Latency data is missing or invalid');
          setIsError(true); // 에러 상태 설정
        }
      } else if (message.type === 'throughput') {
        const { data } = message; // 데이터 추출
        const { result, loss } = data;
    
        if (typeof result === 'number' && typeof loss === 'number') {
          setThroughputData(prevData => ({
            result: [...prevData.result, result],
            loss: [...prevData.loss, loss]
          }));
          setMeasurementResult({
            type: 'Throughput',
            result: result,
            loss: loss
          });
          setResultPage(true); // 결과 페이지로 상태 변경
          setIsError(false); // 에러 상태 해제
        } else {
          setError('Throughput data is missing or invalid');
          setIsError(true); // 에러 상태 설정
        }
      } else if (message.type === 'measurement_error') {
        // 새로운 에러 타입 처리
        setError('Topology changed during measurement.');
        setIsError(true); // 에러 상태 설정
      } //else if (message.type === 'error') {
      //   setError(message.data || 'An unknown error occurred');
      //   setIsError(true); // 에러 상태 설정
      // } 
    };

    // WebSocket 메시지 콜백 설정
    setOnMessageCallback(handleWebSocketMessage);
    sendMessage('fetch_node', { type: 'fetch_node' });

    return () => {
      setOnMessageCallback(null);
    };
  }, []);

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
    // 측정 요청 전에 데이터 초기화
    setLatencyData([]);
    setThroughputData({ result: [], loss: [] });
    setMeasurementResult(null);
    setResultPage(false);

    sendMessage(type.toLowerCase(), { source, destination })
      .catch(error => {
        console.error('Error sending WebSocket message:', error);
        setError('Failed to send measurement request. Please try again.');
        setMeasurementRequested(false); // 에러 발생 시 false로 재설정
        setIsError(true); // 에러 상태 설정
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
    setIsStopMeasurementClicked(false);
    setResultPage(false);
    setLatencyData([]);
    setThroughputData({ result: [], loss: [] }); // Throughput 데이터 초기화
    setIsError(false); // 에러 상태 해제
  };

  const handleStopMeasurement = async () => {
    try {
      sendMessage('cancel_measurement', { type: 'cancel_measurement', source: source, destination: destination });
      
      console.log('Measurement stopped.');
      setMeasurementRequested(false);
      setIsError(false);

      if (!isStopMeasurementClicked) {
        // Stop Measurement 로직 추가
        setIsStopMeasurementClicked(true);
      }

    } catch (error) {
      console.error('Error stopping measurement:', error);
      setIsError(true); 
    }
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '16px' }}>
      <h2>Node Measurement</h2>

      {/* Source Node와 Destination Node 필드가 resultPage가 false일 때만 렌더링됨 */}
      {!resultPage && (
        <>
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
          />
        </>
      )}

      {/* 측정 버튼들이 resultPage가 false일 때만 렌더링됨 */}
      {!resultPage && (
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
      )}

      {error && isError && (
        <Box
          sx={{
            marginTop: 1,
            padding: 1.5, // 상자 내부 패딩 줄이기
            border: '1px solid red',
            backgroundColor: '#fdd',
            maxWidth: '100%', // 상자의 최대 너비 설정
            fontSize: '0.87rem', // 글자 크기 조정
            wordWrap: 'break-word' // 긴 단어가 상자를 넘지 않도록 처리
          }}
        >
          <h3 style={{ marginBottom: '4px' }}>Error</h3> {/* h3의 하단 마진을 줄임 */}
          <p style={{ marginTop: '0px' }}>{error}</p> {/* p의 상단 마진을 없앰 */}
        </Box>
      )}

      {measurementResult && (
        <Box sx={{ marginTop: 1, padding: 2, border: '1px solid gray' }}>
        <h3 style={{ marginBottom: '8px' }}>[ Result ]</h3> 
        <p style={{ marginTop: 0, marginBottom: '10px' }}>
          Source Node [{source}] ➔ Destination Node [{destination}]
        </p>
          {currentMeasurementType === 'Latency' ? (
            <LatencyChartPage 
              latencyData={latencyData} 
              backgroundColor={isError ? 'rgba(255,99,132,0.2)' : 'rgba(75,192,192,0.4)'} 
              borderColor={isError ? 'rgba(255,99,132,1)' : 'rgba(75,192,192,1)'} 
              isError={isError}
            />
          ) : (
            <ThroughputChartPage 
              throughputData={throughputData.result} 
              lossData={throughputData.loss}
              backgroundColor={isError ? 'rgba(255,99,132,0.2)' : 'rgba(75,192,192,0.4)'} 
              borderColor={isError ? 'rgba(255,99,132,1)' : 'rgba(75,192,192,1)'} 
              isError={isError}
            />
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
            sx={{
              ...stopButtonStyles,
              ...(isActive.stop && activeStopButtonStyles), // 클릭된 버튼의 색상 적용
              flex: 1,
              margin: '0 4px',
              '&.Mui-disabled': {
                borderColor: 'red !important',
                color: 'red !important',
              }
            }}
            onClick={handleStopMeasurement}
            disabled={isStopMeasurementClicked || isError} // 에러 상태이거나 측정이 중지된 경우 비활성화
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
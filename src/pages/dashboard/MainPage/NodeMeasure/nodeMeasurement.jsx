import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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
  const [source, setSource] = useState(null); // Autocomplete 선택된 값은 객체로 유지
  const [destination, setDestination] = useState(null); // Autocomplete 선택된 값은 객체로 유지
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
  const [isStop, setIsStop] = useState(false); // isStop 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    let isSubscribed = true;
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
      } else if (isSubscribed && message.type === 'latency') {
        if (message.data && message.data.result != null) {
          setLatencyData(prevData => [...prevData, parseFloat(message.data.result)]);
          setMeasurementResult({ type: 'Latency', value: parseFloat(message.data.result) });
          setResultPage(true); // 결과 페이지로 상태 변경
          setIsError(false); // 에러 상태 해제
        } else {
          setError('Latency data is missing or invalid');
          setIsError(true); // 에러 상태 설정
        }
      } else if (isSubscribed && message.type === 'throughput') {
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
      isSubscribed = false; // 구독 상태 해제
      setOnMessageCallback(null);
    };
  }, [measurementRequested]);

  const handleMeasurement = (type) => {
    
     // 입력값 유효성 검사
    if (!source || !destination) {
      setError('Source and Destination cannot be empty');
      return;
    } else if (source.seq === destination.seq) {
      setError('Source and Destination should be different nodes');
      return;
    } else if (!isNodeSeqValid(parseInt(source.seq), nodes) || !isNodeSeqValid(parseInt(destination.seq), nodes)) {
      setError('Source and Destination should be valid node sequences');
      return;
    } else {
      setError('');
    } 
    setCurrentMeasurementType(type); // 측정 유형 설정
    setMeasurementRequested(true); // 측정 요청 상태를 true로 설정
    setButtonDisabled(true); // 버튼 비활성화 상태 설정
    setLatencyData([]);
    setThroughputData({ result: [], loss: [] });
    setMeasurementResult(null);
    setResultPage(false);
    
   // 서버로 seq 값 전송
    sendMessage(type.toLowerCase(), {
      source: source.seq.toString(),  // 선택된 노드의 seq 값 전송 (문자열로 변환)
      destination: destination.seq.toString() // 선택된 노드의 seq 값 전송
    })
      .catch(error => {
        console.error('Error sending WebSocket message:', error);
        setError('Failed to send measurement request. Please try again.');
        setMeasurementRequested(false); // 에러 발생 시 false로 재설정
        setIsError(true); // 에러 상태 설정
      });

      // 16초 후 버튼을 다시 활성화
    setTimeout(() => {
      setButtonDisabled(false);
    }, 16000);
  };

  const isNodeSeqValid = (value, nodes) => {
    // seq 값이 0 이상이고, nodes 배열에 있는 값인지 확인
    return value >= 0 && nodes.some((node) => node.seq === value);
  };

  const handleClearInputs = () => {
    setSource(null); // Source 선택 초기화
    setDestination(null); // Destination 선택 초기화
    setError('');
  };

  const handleClearResults = () => {
    setIsStop(false); // Clear Results 클릭 시 isStop을 false로 초기화
    setMeasurementResult(null);
    setCurrentMeasurementType(null);
    setSource(null);
    setDestination(null);
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
      sendMessage('cancel_measurement', { type: 'cancel_measurement' });
      setIsStopMeasurementClicked(true);
      setIsStop(true);
    } catch (error) {
      console.error('Error stopping measurement:', error);
    }
  };
 
  // Autocomplete 노드 선택 옵션 설정
  const nodeOptions = nodes.map(node => ({
    label: `Node ${node.seq}`,  // 보여지는 옵션
    seq: node.seq  // 실제로 사용되는 seq 값
  }));

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '50vh', paddingLeft: '16px' }}>
      <h2>Node Measurement</h2>

       {/* Source Node 선택 필드 */}
       {!resultPage && (
       <Autocomplete
        options={nodeOptions}
        getOptionLabel={(option) => option.label}
        value={source} // 선택된 값을 Autocomplete에 설정
        onChange={(event, newValue) => {
          setSource(newValue); // 선택된 노드 객체 설정
          setError('');
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Source Node"
            value={source ? source.seq : ''}  // seq 값만 렌더링
            error={!!error}
            helperText={error}
            fullWidth
            disabled={!!measurementResult} // 결과가 있으면 비활성화
            sx={textFieldStyles}
            margin="normal"
          />
        )}
      />
      )}

      {/* Destination Node 선택 필드 */}
      {!resultPage && (
      <Autocomplete
        options={nodeOptions}
        getOptionLabel={(option) => option.label}
        value={destination} // 선택된 값을 Autocomplete에 설정
        onChange={(event, newValue) => {
          setDestination(newValue); // 선택된 노드 객체 설정
          setError('');
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Destination Node"
            value={destination ? destination.seq : ''}  // seq 값만 렌더링
            error={!!error}
            helperText={error}
            fullWidth
            margin="normal"
            disabled={!!measurementResult}
            sx={textFieldStyles}
          />
        )}
      />
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
            padding: 1.5, 
            border: '1px solid red',
            backgroundColor: '#fdd',
            maxWidth: '100%', 
            fontSize: '0.87rem', 
            wordWrap: 'break-word' 
          }}
        >
          <h3 style={{ marginBottom: '4px' }}>Error</h3> {/* h3의 하단 마진을 줄임 */}
          <p style={{ marginTop: '0px' }}>{error}</p> {/* p의 상단 마진을 없앰 */}
        </Box>
      )}

      {measurementResult && (
        <Box sx={{ marginTop: 1, padding: 2, border: '1px solid gray', minHeight: 'auto' }}>
        <h3 style={{ marginBottom: '8px' }}>[ Result ]</h3> 
        <p style={{ marginTop: 0, marginBottom: '10px' }}>
          Source Node [{source.seq}] ➔ Destination Node [{destination.seq}]
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
            disabled={measurementRequested} // 측정 중일 때 비활성화
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
            disabled={isStopMeasurementClicked || isStop}
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
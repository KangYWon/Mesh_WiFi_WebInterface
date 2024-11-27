import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { buttonStyles, clearButtonStyles } from 'src/components/styles.js';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket'; // WebSocket 관련 함수

const NodeMeasurementForm = ({ onMeasurementStart, onClearInputs, onClearResults, buttonDisabled }) => {
  const [nodes, setNodes] = useState([]); // 서버에서 받아온 노드 데이터를 저장할 상태
  const [source, setSource] = useState(''); // 선택된 Source 노드의 seq 값만 저장
  const [destination, setDestination] = useState(''); // 선택된 Destination 노드의 seq 값만 저장
  const [measurementResult, setMeasurementResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleWebSocketMessage = (message) => {
      try {
        if (message.type === 'fetch_node') {
          console.log('from fetch_node', message.data);
          setNodes(message.data); // 서버에서 받아온 데이터를 상태에 저장
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    setOnMessageCallback(handleWebSocketMessage);
    sendMessage('fetch_node', { type: 'fetch_node' });

    return () => {
      setOnMessageCallback(null); 
    };
  }, []);

  const handleMeasurement = (type) => {
    if (!source || !destination) {
      setError('Source and Destination cannot be empty');
      return;
    }
    if (source === destination) {
      setError('Source and Destination should be different nodes');
      return;
    }

    setError('');
    onMeasurementStart(type, source, destination);
  };

  return (
    <Box>
      <h2>Node Measurement</h2>

      {/* 노드 선택을 위한 Autocomplete, 가로로 나열 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginBottom: 2 }}>
        <Autocomplete
          options={nodes} // 서버에서 받아온 노드 데이터
          getOptionLabel={(option) => `Seq: ${option.seq} - MAC: ${option.mac}`} // 표시할 텍스트
          onChange={(event, newValue) => {
            setSource(newValue?.seq || ''); // 선택한 노드의 seq 값만 저장
            setError('');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Source Node"
              margin="normal"
              error={!!error}
              helperText={error}
            />
          )}
          sx={{ width: '48%' }} // 가로 배치
        />

        <Autocomplete
          options={nodes} // 서버에서 받아온 노드 데이터
          getOptionLabel={(option) => `Seq: ${option.seq} - MAC: ${option.mac}`} // 표시할 텍스트
          onChange={(event, newValue) => {
            setDestination(newValue?.seq || ''); // 선택한 노드의 seq 값만 저장
            setError('');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Destination Node"
              margin="normal"
              error={!!error}
              helperText={error}
            />
          )}
          sx={{ width: '48%' }} // 가로 배치
        />
      </Box>

      {/* Throughput 및 Latency 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button
          variant="contained"
          sx={buttonStyles}
          onClick={() => handleMeasurement('Throughput')}
          disabled={buttonDisabled}
        >
          Throughput
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles}
          onClick={() => handleMeasurement('Latency')}
          disabled={buttonDisabled}
        >
          Latency
        </Button>
      </Box>

      {/* Clear Inputs 버튼 */}
      {(source || destination) && !measurementResult && (
        <Button
          variant="outlined"
          sx={clearButtonStyles}
          onClick={onClearInputs}
          fullWidth
          style={{ marginTop: '16px' }}
        >
          Clear Inputs
        </Button>
      )}

      {/* Clear Results 버튼 */}
      {measurementResult && (
        <Button
          variant="outlined"
          sx={clearButtonStyles}
          onClick={onClearResults}
          fullWidth
          style={{ marginTop: '16px' }}
        >
          {resultPage ? 'Stop Measurement' : 'Clear Results'}
        </Button>
      )}
    </Box>
  );
};

export default NodeMeasurementForm;
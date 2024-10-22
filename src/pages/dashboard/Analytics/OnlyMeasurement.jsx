import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';
import {
  textFieldStyles,
  buttonStyles,
  clearButtonStyles,
} from 'src/components/styles.js';

export default function SimplifiedNodeMeasurement() {
  const [nodes, setNodes] = useState([]);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    // WebSocket 메시지 처리 및 노드 데이터 설정
    const handleWebSocketMessage = (message) => {
      if (message.type === 'fetch_node') {
        const nodeDataFromServer = message.data;
        setNodes(nodeDataFromServer);
      }
    };

    setOnMessageCallback(handleWebSocketMessage);
    sendMessage('fetch_node', { type: 'fetch_node' });

    return () => {
      setOnMessageCallback(null); // WebSocket 메시지 콜백 해제
    };
  }, []);

  const handleMeasurement = (type) => {
    if (!source || !destination) {
      setError('Source and Destination cannot be empty');
      return;
    } else if (source.seq === destination.seq) {
      setError('Source and Destination should be different nodes');
      return;
    } else {
      setError('');
    }

    setButtonDisabled(true); // 버튼 비활성화
    sendMessage(type.toLowerCase(), {
      source: source.seq.toString(),
      destination: destination.seq.toString(),
    })
      .catch((error) => {
        console.error('Error sending WebSocket message:', error);
        setError('Failed to send measurement request. Please try again.');
        setButtonDisabled(false);
      });

    // 10초 후 버튼을 다시 활성화
    setTimeout(() => {
      setButtonDisabled(false);
    }, 10000);
  };

  const handleClearInputs = () => {
    setSource(null); // Source 선택 초기화
    setDestination(null); // Destination 선택 초기화
    setError('');
  };

  // Autocomplete 노드 선택 옵션 설정
  const nodeOptions = nodes.map((node) => ({
    label: `Node ${node.seq}`,
    seq: node.seq,
  }));

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '50vh', paddingLeft: '16px' }}>
      <h2>Node Measurement</h2>

      {/* Source Node 선택 필드 */}
      <Autocomplete
        options={nodeOptions}
        getOptionLabel={(option) => option.label}
        value={source}
        onChange={(event, newValue) => {
          setSource(newValue);
          setError('');
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Source Node"
            value={source ? source.seq : ''}
            error={!!error}
            helperText={error}
            fullWidth
            sx={textFieldStyles}
            margin="normal"
          />
        )}
      />

      {/* Destination Node 선택 필드 */}
      <Autocomplete
        options={nodeOptions}
        getOptionLabel={(option) => option.label}
        value={destination}
        onChange={(event, newValue) => {
          setDestination(newValue);
          setError('');
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Destination Node"
            value={destination ? destination.seq : ''}
            error={!!error}
            helperText={error}
            fullWidth
            margin="normal"
            sx={textFieldStyles}
          />
        )}
      />

      {/* 측정 버튼 */}
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

      {(source || destination) && (
        <Button
          variant="outlined"
          sx={clearButtonStyles}
          onClick={handleClearInputs}
        >
          Clear Inputs
        </Button>
      )}

      {error && (
        <Box
          sx={{
            marginTop: 1,
            padding: 1.5,
            border: '1px solid red',
            backgroundColor: '#fdd',
            maxWidth: '100%',
            fontSize: '0.87rem',
            wordWrap: 'break-word',
          }}
        >
          <h3 style={{ marginBottom: '4px' }}>Error</h3>
          <p style={{ marginTop: '0px' }}>{error}</p>
        </Box>
      )}
    </Box>
  );
}
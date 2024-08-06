import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { textFieldStyles, buttonStyles, clearButtonStyles } from 'src/components/styles.js';

const NodeMeasurementForm = ({ onMeasurementStart, onClearInputs, onClearResults, buttonDisabled }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [measurementResult, setMeasurementResult] = useState(null);
  const [error, setError] = useState('');

  const handleMeasurement = (type) => {
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
    onMeasurementStart(type, source, destination);
  };

  const isNodeSeqValid = (value, nodes) => {
    return value >= 0 && value < nodes.length;
  };

  return (
    <Box >
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
        sx={textFieldStyles}
      ></TextField>

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

      {(source || destination) && !measurementResult && (
        <Button
          variant="outlined"
          sx={clearButtonStyles}
          onClick={onClearInputs}
        >
          Clear Inputs
        </Button>
      )}

      {measurementResult && (
        <Button
          variant="outlined"
          sx={clearButtonStyles}
          onClick={onClearResults}
        >
          {resultPage ? 'Stop Measurement' : 'Clear Results'}
        </Button>
      )}
    </Box>
  );
};

export default NodeMeasurementForm;
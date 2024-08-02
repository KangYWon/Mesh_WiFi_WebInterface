import React from 'react';
import { TextField, Button, Alert, Paper, Typography } from '@mui/material';
import { textFieldStyles, buttonStyles } from 'src/components/styles.js';

const DeviceForm = ({ newDeviceMac, error, onChange, onSubmit }) => (
  <Paper elevation={3} style={{ padding: '20px' }}>
    <Typography variant="h5" gutterBottom>
      새 노드 등록하기
    </Typography>
    {error && <Alert severity="error">{error}</Alert>}
    <form onSubmit={onSubmit}>
      <TextField
        label="MAC Address"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newDeviceMac}
        onChange={onChange}
        error={!!error}
        helperText={error}
        sx={textFieldStyles}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          sx={buttonStyles} 
          color="primary" 
          type="submit"
        >
          등록
        </Button>
      </div>       
    </form>
  </Paper>
);

export default DeviceForm;
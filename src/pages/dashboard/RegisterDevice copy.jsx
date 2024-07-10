import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Alert, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';

const RegisterDevice = () => {
  const [devices, setDevices] = useState([
    { id: 1, mac: 'AA:BB:CC:DD:EE:FF', status: true },
    { id: 2, mac: '11:22:33:44:55:66', status: true },
    { id: 3, mac: '77:88:99:AA:BB:CC', status: false },
    { id: 4, mac: 'DD:EE:FF:00:11:22', status: false },
    { id: 5, mac: '33:44:55:66:77:88', status: false },
  ]);

  const [newDeviceMac, setNewDeviceMac] = useState('');
  const [error, setError] = useState('');

  const handleAddDevice = (e) => {
    e.preventDefault();
    if (!newDeviceMac) {
      setError('MAC 주소를 입력해 주세요.');
      return;
    }
    const newDevice = { id: devices.length + 1, mac: newDeviceMac, status: false };
    setDevices([...devices, newDevice]);
    setNewDeviceMac('');
    setError(''); // 등록 후 비우기
  };

  const handleDeleteDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  return (
    <Container maxWidth="lg" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '30px' }}>
        노드 등록
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              등록된 노드
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>MAC Address</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map(device => (
                  <TableRow key={device.id}>
                    <TableCell>{device.mac}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <CircleIcon style={{ color: device.status ? 'green' : 'red', verticalAlign: 'middle' }} />
                    </TableCell>
                    <TableCell>
                      <IconButton color="secondary" onClick={() => handleDeleteDevice(device.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              새 노드 등록하기
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleAddDevice}>
              <TextField
                label="MAC Address"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newDeviceMac}
                onChange={(e) => setNewDeviceMac(e.target.value)}
                error={!!error}
                helperText={error}
              />
              <Button variant="contained" color="primary" type="submit">
                등록
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterDevice;
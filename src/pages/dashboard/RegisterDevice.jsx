import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Alert, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';
import { sendMessage } from 'src/api/webSocket.js'; 
import { textFieldStyles, buttonStyles } from 'src/components/styles.js';

const RegisterDevice = () => {
  const [devices, setDevices] = useState([]);
  const [newDeviceMac, setNewDeviceMac] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // 페이지 로드 시 기존 장치 데이터를 서버에서 가져옵니다.
    sendMessage('fetch_devices')
      .then(data => {
        setDevices(data);
      })
      .catch(error => {
        console.error('Error fetching devices:', error);
      });
  }, []);

  const handleAddDevice = (e) => {
    e.preventDefault();
    if (!newDeviceMac) {
      setError('MAC 주소를 입력해 주세요.');
      return;
    }
    sendMessage('create_device', { mac: newDeviceMac })
      .then(newDevice => {
        setDevices([...devices, newDevice]);
        setNewDeviceMac('');
        setError('');
      })
      .catch(error => {
        console.error('Error creating device:', error);
        setError('장치 등록에 실패했습니다.');
      });
  };

  const handleDeleteDevice = (id) => {
    sendMessage('delete_device', { id })
      .then(() => {
        setDevices(devices.filter(device => device.id !== id));
      })
      .catch(error => {
        console.error('Error deleting device:', error);
        setError('장치 삭제에 실패했습니다.');
      });
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
                sx={textFieldStyles}
              />
              <Button variant="contained" 
                sx={buttonStyles}
                color="primary" type="submit">
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
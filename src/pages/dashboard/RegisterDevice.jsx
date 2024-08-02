import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Alert, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';
import { sendMessage } from 'src/api/webSocket.js'; 
import { textFieldStyles, buttonStyles } from 'src/components/styles.js';

const RegisterDevice = () => {
  // 임시 하드 코딩 데이터
  const hardCodedDevices = [
    { id: 1, mac: 'AA:BB:CC:DD:EE:FF', status: true, action: true },
    { id: 2, mac: '11:22:33:44:55:66', status: false, action: true },
  ];

  const [devices, setDevices] = useState(hardCodedDevices);
  const [newDeviceMac, setNewDeviceMac] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // 페이지 로드 시 기존 장치 데이터를 서버에서 가져옵니다.
    // 실제 데이터 로드 부분 주석 처리
    // sendMessage('fetch_devices')
    //   .then(data => {
    //     setDevices(data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching devices:', error);
    //   });
  }, []);

  const handleAddDevice = (e) => {
    e.preventDefault();
    if (!newDeviceMac) {
      setError('MAC 주소를 입력해 주세요.');
      return;
    }
    // 임시 하드 코딩된 새 장치 추가
    const newDevice = { id: devices.length + 1, mac: newDeviceMac, status: false, action: true };
    setDevices([...devices, newDevice]);
    setNewDeviceMac('');
    setError('');

    // 실제 데이터 전송 부분 주석 처리
    // sendMessage('create_device', { mac: newDeviceMac })
    //   .then(newDevice => {
    //     setDevices([...devices, newDevice]);
    //     setNewDeviceMac('');
    //     setError('');
    //   })
    //   .catch(error => {
    //     console.error('Error creating device:', error);
    //     setError('장치 등록에 실패했습니다.');
    //   });
  };

  const handleDeleteDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
    // 실제 데이터 전송 부분 주석 처리
    // sendMessage('delete_device', { id })
    //   .then(() => {
    //     setDevices(devices.filter(device => device.id !== id));
    //   })
    //   .catch(error => {
    //     console.error('Error deleting device:', error);
    //     setError('장치 삭제에 실패했습니다.');
    //   });
  };

  const handleStatusAndActionToggle = (id) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, status: !device.status, action: !device.status } : device
    ));
  };

  const handleRestartDevice = (id) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, action: false } : device
    ));
    sendMessage('restart_device', { id })
      .then(() => {
        setDevices(devices.map(device => 
          device.id === id ? { ...device, action: true } : device
        ));
      })
      .catch(error => {
        console.error('Error restarting device:', error);
        setError('장치 재시작에 실패했습니다.');
      });
  };

  const containerStyles = {
    display: 'flex',
    justifyContent: 'flex-end' // 버튼을 오른쪽으로 정렬
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
                  <TableCell style={{ textAlign: 'center' }}>Status/Action</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map(device => (
                  <TableRow key={device.id}>
                    <TableCell>{device.mac}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                    <IconButton 
                        onClick={() => device.status && handleRestartDevice(device.id)}
                        disabled={!device.status}
                      >
                        <CircleIcon 
                          style={{ 
                            color: device.status ? (device.action ? 'green' : 'rgb(217, 13, 13, 0.9') : 'gray', 
                            verticalAlign: 'middle' 
                          }} 
                        />
                      </IconButton>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <IconButton 
                        color="secondary" 
                        onClick={() => handleDeleteDevice(device.id)}
                      >
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
              <div style={containerStyles}>
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterDevice;
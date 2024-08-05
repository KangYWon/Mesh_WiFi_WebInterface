import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography  } from '@mui/material';
import { sendMessage } from 'src/api/webSocket.js'; 
import DeviceList from './DeviceList';
import DeviceForm from './DeviceForm';

const RegisterDevice = () => {
  // 임시 하드 코딩 데이터
  const hardCodedDevices = [
    { id: 1, mac: 'AA:BB:CC:DD:EE:FF', status: true, action: true },//자체에서 true에서 false로 바꾼다. (서버에서는 true값 유지하고 보내주면 나는 true가 되는 식. )
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

  const handleRestartDevice = async (id) => {
    try {
      // 업데이트 전에 action을 false로 설정
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === id ? { ...device, action: false } : device
        )
      );
  
      // 서버에 메시지 전송
      await sendMessage('restart', { type: 'restart', destination: { id } });
  
      // 메시지 전송 성공 후 action을 true로 설정
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === id ? { ...device, action: true } : device
        )
      );
  
    } catch (error) {
      // 에러 처리
      console.error('Error restarting device:', error);
      setError('장치 재시작에 실패했습니다.');
    }
  };

  return (
    <Container maxWidth="lg" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '30px' }}>
        노드 등록
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <DeviceList 
            devices={devices} 
            onDelete={handleDeleteDevice} 
            onRestart={handleRestartDevice} 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DeviceForm 
            newDeviceMac={newDeviceMac} 
            error={error} 
            onChange={(e) => setNewDeviceMac(e.target.value)} 
            onSubmit={handleAddDevice} 
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterDevice;
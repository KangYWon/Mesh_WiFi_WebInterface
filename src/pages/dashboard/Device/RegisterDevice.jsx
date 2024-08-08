import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js'; 
import DeviceList from './DeviceList';
import DeviceForm from './DeviceForm';

const RegisterDevice = () => {
  const [devices, setDevices] = useState([]);
  const [newDeviceMac, setNewDeviceMac] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDevices();

    // Set up WebSocket message handler
    const handleMessage = (message) => {
      if (message.type === 'fetch_devices') {
        const fetchedDevices = message.data.map(device => ({
          ...device,
          status: device.status === 1,
          action: device.action === 1
        }));
        setDevices(fetchedDevices);
      }
    };

    setOnMessageCallback(handleMessage);

    return () => {
      // Clean up WebSocket message handler
      setOnMessageCallback(null);
    };
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await sendMessage('fetch_devices');
      console.log('Raw server response:', response); // 서버 응답의 원시 데이터를 로그로 출력
      if (response && response.data) {
        // 서버 응답 데이터를 불리언으로 변환
        const fetchedDevices = response.data.map(device => ({
          ...device,
          status: device.status === 1,
          action: device.action === 1
        }));
        setDevices(fetchedDevices);
      } else {
        console.warn('No data found in server response.');
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!newDeviceMac) {
      setError('MAC 주소를 입력해 주세요.');
      return;
    }

    try {
      // 장치 추가 요청
      setNewDeviceMac('');
      setError('');
      const response = await sendMessage('add_device', { mac: newDeviceMac });
      console.log('Server response for add_device:', response);
  
      // 장치 등록 성공 여부를 확인하기 위한 로직 추가
      // 이 부분은 서버의 응답에 따라 조정할 수 있습니다.
      // 예를 들어, 서버 응답이 성공을 나타내는 경우를 처리할 수 있습니다.
  
    } catch (error) {
      // 입력 필드 클리어
      setNewDeviceMac('');
      // console.error('Error creating device:', error);
      // setError('장치 등록에 실패했습니다.');
    }
  };

  const handleDeleteDevice = async (id) => {
    await sendMessage('delete_device', { id });
    setDevices(prevDevices => prevDevices.filter(device => device.id !== id));
  };

  const handleRestartDevice = async (id) => {
    try {
      // 업데이트 전에 action을 false로 설정
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === id ? { ...device, action: false } : device
        )
      );
  
      // 서버에 메시지 전송 및 응답 받기
      const response = sendMessage('restart', { type: 'restart', id: id });
      console.log('Server response for restart:', response);

      // 서버 응답에서 action 값을 확인하고 상태 업데이트
      if (response && response.action === true) {
        // 서버 응답이 성공을 나타낼 경우 상태 업데이트
        setDevices(prevDevices => 
          prevDevices.map(device => 
            device.id === id ? { ...device, status: true, action: true } : device
          )
        );
        // 에러 상태를 비워줍니다 (성공 시)
        setError('');
      } 
    } catch (error) {
      console.error('Error restarting device:', error);
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === id ? { ...device, action: true } : device
        )
      );
      setError('장치 재시작에 실패했습니다.');
    }
  };

  const handleFocus = () => {
    setError('');
    setNewDeviceMac(''); 
  };

  const handleReorder = (result) => {
    if (!result.destination) return;

    const reorderedDevices = Array.from(devices);
    const [removed] = reorderedDevices.splice(result.source.index, 1);
    reorderedDevices.splice(result.destination.index, 0, removed);

    setDevices(reorderedDevices);
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
            onReorder={handleReorder} 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DeviceForm 
            newDeviceMac={newDeviceMac} 
            error={error} 
            onChange={(e) => setNewDeviceMac(e.target.value)} 
            onSubmit={handleAddDevice} 
            onFocus={handleFocus}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterDevice;
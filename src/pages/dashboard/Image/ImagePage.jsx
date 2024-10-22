import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper, Typography, Container, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Footer from 'src/pages/extra-pages/footer.jsx';
import MapContainer from 'src/pages/dashboard/MainPage/mapContainer.jsx';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';

// Layer 색상 정의
const layerColors = {
  1: 'red', 
  2: 'orange', 
  3: '#ffff5e', 
  4: 'green', 
  5: 'skyblue', 
  6: 'blue', 
  7: 'purple', 
  8: 'pink', 
  9: 'brown', 
  10: 'gray', 
  11: 'white'
};

// 원형 도형을 렌더링하는 함수
const renderLayerCircle = (layer) => {
  if (layer === undefined || layer === null || !(layer in layerColors)) {
    return null; // layer 정보가 없거나 유효하지 않으면 아무것도 렌더링하지 않음
  }
  const layerColor = layerColors[layer];
  return (
    <div
      style={{
        display: 'inline-block',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: layerColor,
        verticalAlign: 'middle',
      }}
    />
  );
};

const DeviceListWithOverlayPhoto = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null); // 새로운 상태 추가
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // WebSocket 메시지 핸들러 설정
    const handleWebSocketMessage = (message) => {
      try {
        if (message.type === 'fetch_node') {
          const fetchedDevices = (message.data || []).map((device) => ({
            ...device,
            photoAvailable: true,
          }));
          setDevices(fetchedDevices);
        } else if (message.type === 'photo_response') {
          if (message.data) {
            // 기존 Blob URL 해제
            if (photoUrl) {
              URL.revokeObjectURL(photoUrl);
            }
            // Base64 문자열을 바이너리 데이터로 디코딩
            const base64Data = message.data;
            const binaryString = atob(base64Data);
            const len = binaryString.length;
            const byteArray = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              byteArray[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            const photoUrl = URL.createObjectURL(blob);
            setPhotoUrl(newPhotoUrl);
            setPhoto(photoUrl);
          } else {
            console.error('Photo response data is missing');
          }
          setIsFetching(false);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        setIsFetching(false);
      }
    };

    setOnMessageCallback(handleWebSocketMessage);
    sendMessage('fetch_node', { type: 'fetch_node' });

    return () => {
      setOnMessageCallback(null);
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl); // 컴포넌트 언마운트 시 Blob URL 해제
      }
    };
  }, [photoUrl]);

  const handlePhotoRequest = (device) => {
    if (device && device.photoAvailable) {
      setIsFetching(true);
      setShowOverlay(true);
      setPhoto(null); // 초기화

      sendMessage('take_pic', { type: 'take_pic', destination: device.seq });
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setPhoto(null);
  };

  const handleReorder = (result) => {
    if (!result.destination) return;

    const reorderedDevices = Array.from(devices);
    const [movedDevice] = reorderedDevices.splice(result.source.index, 1);
    reorderedDevices.splice(result.destination.index, 0, movedDevice);
    setDevices(reorderedDevices);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {showOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: 'relative',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '80%',
              maxHeight: '80%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={handleCloseOverlay}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              <CloseIcon />
            </IconButton>
            {isFetching ? (
              <Typography variant="h6">Fetching Photo...</Typography>
            ) : (
              photo && <img src={photo} alt="Device Photo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            )}
          </div>
        </div>
      )}

      <Container maxWidth="lg" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '30px' }}>
          촬영 노드 목록
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', height: '50vh', marginBottom: '20px' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginRight: '16px' }}>
            <MapContainer style={{ width: '100%', height: '100%' }} />
          </Box>
        </Box>
        <Paper elevation={3} style={{ padding: '20px', zIndex: showOverlay ? 0 : 'auto' }}>
          <DragDropContext onDragEnd={handleReorder}>
            <Droppable droppableId="deviceList">
              {(provided) => (
                <Table ref={provided.innerRef} {...provided.droppableProps}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Seq/Layer</TableCell>
                      <TableCell>MAC Address</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>Photo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {devices.map((device, index) => (
                      <Draggable key={device.id?.toString() || index} draggableId={device.id?.toString() || index.toString()} index={index}>
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              backgroundColor: 'inherit', 
                              ...provided.draggableProps.style,
                            }}
                          >
                            <TableCell>
                              {device.seq !== undefined && device.seq !== null ? `${device.seq}` : ''} /{' '}
                              {renderLayerCircle(device.layer)}
                            </TableCell>
                            <TableCell>{device.my_mac || 'Unknown'}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              <IconButton
                                onClick={() => handlePhotoRequest(device)}
                              >
                                <CameraAltIcon
                                  style={{
                                    color: 'black',
                                  }}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                </Table>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default DeviceListWithOverlayPhoto;
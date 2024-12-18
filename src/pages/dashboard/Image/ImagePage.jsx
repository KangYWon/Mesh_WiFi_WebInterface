import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper, Typography, Container, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Footer from 'src/pages/extra-pages/footer.jsx';
import MapContainer from 'src/pages/dashboard/MainPage/mapContainer.jsx';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';
import "src/pages/dashboard/Image/spin.css";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'; // 아이콘 임포트 추가

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
  const [error, setError] = useState(null); // 에러 상태 추가
  const [canRequestPhoto, setCanRequestPhoto] = useState(true); // 요청 가능 여부 상태

  const errorTimerRef = useRef(null); // 에러 타이머를 저장하는 ref

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
            // 기존 타이머를 취소하여 에러 메시지가 표시되지 않게 함
            if (errorTimerRef.current) {
              clearTimeout(errorTimerRef.current);
              errorTimerRef.current = null;
            }
            // Base64 문자열을 바이너리 데이터로 디코딩
            const byteCharacters = atob(message.data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            const newPhotoUrl = URL.createObjectURL(blob);
  
            // 기존 Blob URL 해제 후 상태 업데이트
            setPhotoUrl((prevUrl) => {
              if (prevUrl) {
                URL.revokeObjectURL(prevUrl);
              }
              return newPhotoUrl;
            });
            setPhoto(newPhotoUrl);
            setError(null); // 에러 초기화
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
  }, []);

   const handlePhotoRequest = (device) => {
    if (device && device.photoAvailable && canRequestPhoto) {
      setIsFetching(true);
      setShowOverlay(true);
      setPhoto(null);
      setError(null);

      sendMessage('take_pic', { type: 'take_pic', destination: device.seq });

      setCanRequestPhoto(false); // 요청 잠금 설정
      setTimeout(() => {
        setCanRequestPhoto(true); // 10초 후 요청 가능하게 설정
      }, 10000);

      errorTimerRef.current = setTimeout(() => {
        if (!photo) {
          setIsFetching(false);
          setError("사진을 받아오지 못했어요");
        }
      }, 15000);
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setPhoto(null);
    setError(null); // 에러 초기화

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current); // 타이머 취소
      errorTimerRef.current = null;
    }
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
              width: isFetching ? '100px' : '410px', // 로딩 중일 때와 사진이 나올 때 크기 설정
              height: isFetching ? '100px' : '280px',
              overflow: 'auto',
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
            {error ? (
              <>
              <Typography variant="h6" color="error">{error}</Typography>
              <InsertPhotoIcon style={{ fontSize: '80px', color: 'gray', marginTop: '30px' }} /> {/* 이미지 없음 아이콘 */}
              </>
            ) : isFetching ? (
              <div className="spin">⏳</div> // 로딩 중일 때
            ) : (
              photo && (
                <img
                  src={photo}
                  alt="Device Photo"
                  style={{
                    width: 'auto',
                    height: 'auto',
                  }}
                />
              )
            )}
          </div>
        </div>
      )}

      <Container maxWidth="lg" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '30px' }}>
          List of Shooting Nodes
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
                                disabled={!canRequestPhoto} // 요청 제한
                              >
                                <CameraAltIcon
                                  style={{
                                    color: canRequestPhoto ? 'black' : 'gray', // 요청 불가능 시 회색
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
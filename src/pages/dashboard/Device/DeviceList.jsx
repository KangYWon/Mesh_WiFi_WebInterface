import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';
import MapContainer from 'src/pages/dashboard/MainPage/mapContainer.jsx';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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


const DeviceList = ({ devices = [], onDelete, onRestart, onReorder }) => (
  <Box style={{ padding: '20px' }}>
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', height: '50vh', marginBottom: '20px' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginRight: '16px' }}>
        <MapContainer style={{ width: '100%', height: '100%' }} />
      </Box>
    </Box>
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        등록된 노드
      </Typography>
      <DragDropContext onDragEnd={onReorder}>
        <Droppable droppableId="deviceList">
          {(provided) => (
            <Table ref={provided.innerRef} {...provided.droppableProps}>
              <TableHead>
                <TableRow>
                  <TableCell>Seq/Layer</TableCell>
                  <TableCell>MAC Address</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Status/Action</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((device, index) => {
                  if (!device || !device.mac) {
                    console.error('Device is missing mac property:', device);
                    return null;
                  }

                  return (
                    <Draggable key={device.id} draggableId={device.id.toString()} index={index}>
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TableCell>
                            {device.seq !== undefined && device.seq !== null ? `${device.seq}` : ''} /{' '}
                            {renderLayerCircle(device.layer)} {/* 원형 도형을 렌더링 */}
                          </TableCell>
                          <TableCell>{device.mac}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            <IconButton
                              onClick={() => device.status && onRestart(device.id)}
                              disabled={!device.status}
                            >
                              <CircleIcon
                                style={{
                                  color: device.status
                                    ? device.action
                                      ? 'green'
                                      : 'rgb(217, 13, 13, 0.9)'
                                    : 'rgb(216, 216, 216)',
                                  verticalAlign: 'middle',
                                }}
                              />
                            </IconButton>
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            <IconButton color="secondary" onClick={() => onDelete(device.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  </Box>
);

export default DeviceList;
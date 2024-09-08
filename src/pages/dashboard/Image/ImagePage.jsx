import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper, Typography, Button, Box, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DeviceListWithImageUpload = ({ devices = [], onDelete, onRestart, onReorder }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
    setError(''); // Clear any previous errors
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the uploaded image
    }
  };

  const handleSave = () => {
    if (!selectedDevice) {
      setError('No device selected');
      return;
    }
    if (!image) {
      setError('No image uploaded');
      return;
    }
    // Add logic to save the image for the selected device
    console.log(`Saving image for device ${selectedDevice.id}`);
  };

  const handleClear = () => {
    setImage(null);
    setSelectedDevice(null);
    setError('');
  };

  return (
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
                {devices.map((device, index) => (
                  <Draggable key={device.id} draggableId={device.id.toString()} index={index}>
                    {(provided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => handleDeviceClick(device)}
                        style={{
                          backgroundColor: selectedDevice?.id === device.id ? '#f0f8ff' : 'inherit',
                        }}
                      >
                        <TableCell>
                          {device.seq ? `${device.seq}` : ''} / {device.layer ? `${device.layer}` : ''}
                        </TableCell>
                        <TableCell>{device.mac}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <IconButton onClick={() => device.status && onRestart(device.id)} disabled={!device.status}>
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
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>

      <Box mt={4}>
        <Typography variant="h6">Image from Device: {selectedDevice ? selectedDevice.mac : 'None Selected'}</Typography>

        <Box mt={2} mb={2}>
          <TextField
            type="file"
            onChange={handleImageUpload}
            inputProps={{ accept: 'image/*' }}
            disabled={!selectedDevice}
            fullWidth
          />
        </Box>

        {image && (
          <Box mt={2} mb={2}>
            <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          </Box>
        )}

        {error && (
          <Typography variant="body2" color="error" mt={2}>
            {error}
          </Typography>
        )}

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={!selectedDevice || !image}>
            저장
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClear}>
            Clear
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DeviceListWithImageUpload;
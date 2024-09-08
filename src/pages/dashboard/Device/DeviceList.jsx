import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DeviceList = ({ devices = [], onDelete, onRestart, onReorder }) => (
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
                          {device.seq ? `${device.seq}` : ''} / {device.layer ? `${device.layer}` : ''} {/* seq/layer 정보 표시 */}
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
);

export default DeviceList;
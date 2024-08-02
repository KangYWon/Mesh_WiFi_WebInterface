import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';

const DeviceList = ({ devices, onDelete, onRestart }) => (
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
                onClick={() => device.status && onRestart(device.id)}
                disabled={!device.status}
              >
                <CircleIcon 
                  style={{ 
                    color: device.status ? (device.action ? 'green' : 'rgb(217, 13, 13, 0.9)') : 'gray', 
                    verticalAlign: 'middle' 
                  }} 
                />
              </IconButton>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <IconButton 
                color="secondary" 
                onClick={() => onDelete(device.id)}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

export default DeviceList;
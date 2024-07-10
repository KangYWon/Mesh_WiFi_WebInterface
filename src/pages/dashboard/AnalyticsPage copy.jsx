// src/pages/Analytics.js
import React from 'react';
import { Container, Grid, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const AnalyticsPage = () => {
  const nodes = [
    { id: 0, label: 'Node 0', coordinates: [36.103182, 129.387296], layer: 1 },
    { id: 1, label: 'Node 1', coordinates: [36.103690, 129.387744], layer: 2 },
    { id: 2, label: 'Node 2', coordinates: [36.103013, 129.387494], layer: 2 },
    { id: 3, label: 'Node 3', coordinates: [36.102664, 129.387588], layer: 3 },
    { id: 4, label: 'Node 4', coordinates: [36.103041, 129.388316], layer: 3 },
  ];

  const throughputResults = [
    ['-', '100 Mbps', '80 Mbps', '-', '-'],
    ['100 Mbps', '-', '-', '90 Mbps', '85 Mbps'],
    ['80 Mbps', '-', '-', '-', '-'],
    ['-', '90 Mbps', '-', '-', '-'],
    ['-', '85 Mbps', '-', '-', '-'],
  ];

  const latencyResults = [
    ['-', '10 ms', '20 ms', '-', '-'],
    ['10 ms', '-', '-', '15 ms', '25 ms'],
    ['20 ms', '-', '-', '-', '-'],
    ['-', '15 ms', '-', '-', '-'],
    ['-', '25 ms', '-', '-', '-'],
  ];

  const tableStyle = {
    minHeight: '300px',
  };

  const cellStyle = {
    fontSize: '0.840rem', // 글씨 크기 
    textAlign: 'center',
    border: '1px solid rgba(224, 224, 224, 1)', // 테이블 테두리
  };

  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
  ];

  const layerColors = {
    1: 'red',
    2: 'green',
    3: 'blue',
  };

  return (
    <Container maxWidth="lg" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '30px' }}>
        Analytics
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', ...tableStyle }}>
            <Typography variant="h6" gutterBottom align="center">
              Throughput 측정 결과
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={cellStyle}></TableCell>
                  {nodes.map(node => (
                    <TableCell key={node.id} sx={cellStyle}>
                      {node.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {nodes.map((node, rowIndex) => (
                  <TableRow key={node.id}>
                    <TableCell sx={cellStyle}>
                      {node.label}
                    </TableCell>
                    {nodes.map((_, colIndex) => (
                      <TableCell key={colIndex} sx={cellStyle}>
                        {throughputResults[rowIndex][colIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', ...tableStyle }}>
            <Typography variant="h6" gutterBottom align="center">
              Latency 측정 결과
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={cellStyle}></TableCell>
                  {nodes.map(node => (
                    <TableCell key={node.id} sx={cellStyle}>
                      {node.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {nodes.map((node, rowIndex) => (
                  <TableRow key={node.id}>
                    <TableCell sx={cellStyle}>
                      {node.label}
                    </TableCell>
                    {nodes.map((_, colIndex) => (
                      <TableCell key={colIndex} sx={cellStyle}>
                        {latencyResults[rowIndex][colIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        
      </Grid>
    </Container>
  );
};

export default AnalyticsPage;
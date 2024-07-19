import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import Latency from './Latency';
import Throughput from './Throughput';
import MapContainer from 'src/pages/container/mapContainer.jsx';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { Outlet } from 'react-router-dom';

const AnalyticsPage = () => {
  const [nodes, setNodes] = useState(Array.from({ length: 10 }, (_, index) => ({
    id: index,
    label: `Node ${index}`, 
    //coordinates: [36.1, 129.4],
    latitude: 36.1 + (index * 0.001), // Slightly adjust latitude for each node
    longitude: 129.4 + (index * 0.001), 
    layer: Math.floor(Math.random() * 3) + 1
  })));
  const [throughputResults, setThroughputResults] = useState(Array.from({ length: 10 }, () => Array.from({ length: 7 }, () => '-')));
  const [latencyResults, setLatencyResults] = useState(Array.from({ length: 10 }, () => Array.from({ length: 7 }, () => '-')));
  const [error, setError] = useState('');

  const tableStyle = {
    minHeight: '300px',
  };

  return (
    <Container maxWidth="lg" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '30px' }}>
        Analytics
      </Typography>
      <Grid container spacing={4} direction="column">
        <Grid item xs={12}>
          <Breadcrumbs navigation={navigation} title />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', height: '100%' }}>
            <Box sx={{ flex: 1.3, display: 'flex', flexDirection: 'column', marginRight: '16px', height: '50vh' }}>
              <MapContainer
                nodes={nodes}
                selectedNode={null}
                connections={[]} // Add appropriate connections if needed
                onNodeClick={() => {}}
                style={{ width: '100%', height: '100%' }}
              />
            </Box>
          </Box>
          <Outlet />
        </Grid>
        <Grid item xs={12}>
          <Latency />
        </Grid>
        <Grid item xs={12}>
          <Throughput />
        </Grid>
      </Grid>
    </Container>
  );  
};

export default AnalyticsPage;
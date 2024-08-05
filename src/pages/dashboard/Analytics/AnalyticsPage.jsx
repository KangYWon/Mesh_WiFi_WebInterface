import React from 'react';
import { Container, Grid, Typography, } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import Latency from './Latency';
import Throughput from './Throughput';
import MapContainer from 'src/pages/dashboard/MainPage/mapContainer.jsx';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { Outlet } from 'react-router-dom';
import navigation from 'layout/Dashboard/Drawer/DrawerContent/Navigation';

const AnalyticsPage = () => {

  return (
    <Container maxWidth="lg" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '30px' }}>
        Analytics
      </Typography>
      <Grid container spacing={4} direction="column">
        <Grid item xs={12}>
          <Breadcrumbs navigation={navigation} title/>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', height: '100%' }}>
            <Box sx={{ flex: 1.3, display: 'flex', flexDirection: 'column', marginRight: '16px', height: '50vh' }}>
              <MapContainer/>
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
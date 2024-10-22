import React from 'react';
import { Container, Grid, Typography, Paper } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import Latency from './Latency';
import Throughput from './Throughput';
import MapContainer from 'src/pages/dashboard/MainPage/mapContainer.jsx';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import OnlyMeasurement from 'src/pages/dashboard/Analytics/OnlyMeasurement.jsx';
import { Outlet } from 'react-router-dom';
import navigation from 'layout/Dashboard/Drawer/DrawerContent/Navigation';
import Footer from 'src/pages/extra-pages/footer.jsx';

const AnalyticsPage = () => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Container maxWidth="lg" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '30px' }}>
        Analytics
      </Typography>
      <Grid container spacing={4} direction="column">
        <Grid item xs={12}>
          <Breadcrumbs navigation={navigation} title/>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', height: '50vh' }}>
            {/* 왼쪽 절반에 MapContainer 배치 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginRight: '16px' }}>
              <MapContainer style={{ width: '100%', height: '100%' }} />
            </Box>
            {/* 오른쪽 절반에 OnlyMeasurement 배치 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Paper 
                sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  width: '100%', 
                  height: '100%', // 높이를 부모 Box와 동일하게 설정
                  padding: '20px' 
                }}
              >
                <OnlyMeasurement style={{ width: '100%', height: '100%' }} />
              </Paper>
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
    <Footer />
    </div>
  );  
};

export default AnalyticsPage;
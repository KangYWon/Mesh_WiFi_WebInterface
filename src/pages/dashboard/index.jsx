import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Paper, Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Footer from 'src/pages/extra-pages/footer.jsx';

// project import
import Drawer from 'src/layout/Dashboard/Drawer';
import Header from 'src/layout/Dashboard/Header';
import Loader from 'components/Loader';

// import the new containers
import MapContainer from 'src/pages/dashboard/MainPage/mapContainer.jsx';
import NodeMeasurement from 'src/pages/dashboard/MainPage/NodeMeasure/nodeMeasurement.jsx';
import LayerContainer from 'src/pages/dashboard/MainPage/layerContainer.jsx';
import SplitPane from 'react-split-pane';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// dashboard page의 Layout 컴포넌트
// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));

  useEffect(() => {
    handlerDrawerOpen(!downXL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="xl" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', minHeight: '100vh' }}>
        <Header />
        <Drawer />
        <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
          <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', mt: '-70px' }}>
            <Toolbar />
           
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', height: '100%' }}>
              <SplitPane
                split="vertical"
                minSize={200}
                maxSize={800}
                defaultSize="50%"
                style={{ position: 'relative', height: '100%', width: '100%' }}
                resizerStyle={{ background: '#f0f0f0', width: '10px', cursor: 'col-resize' }}
              >
                {/* 왼쪽 Pane */}
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                  <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column', position: 'relative', minHeight: '400px' }}>
                    <MapContainer style={{ width: '100%', height: '100%', minHeight: '400px', flexGrow: 1 }} />
                  </Box>
                  <Box sx={{ flex: '0 1 auto', display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
                    <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', padding: '20px' }}>
                      <NodeMeasurement style={{ width: '100%', height: '100%' }} />
                    </Paper>
                  </Box>
                </Box>
                
                {/* 오른쪽 Pane */}
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1, overflow: 'auto' }}>
                  <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '5px', height: '100%' }}>
                    <LayerContainer style={{ width: '100%', height: '100%', overflow: 'auto' }} />
                  </Paper>
                </Box>
              </SplitPane>
            </Box>
            <Outlet />
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container} from '@mui/material';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project import
import Drawer from 'src/layout/Dashboard/Drawer';
import Header from 'src/layout/Dashboard/Header';
import navigation from 'menu-items';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// import the new containers
import NodeMeasurement from 'src/pages/container/nodeMeasurement.jsx';
import LayerContainer from 'src/pages/container/layerContainer.jsx';
import MapContainer from 'src/pages/container/mapContainer.jsx';

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
    <Container maxWidth="xl" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', minHeight: '100vh' }}>
      <Header />
      <Drawer />
      <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
        <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', marginTop: '-70px' }}>
          <Toolbar />
          <Breadcrumbs navigation={navigation} title />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', height: '100%' }}>
              <Box sx={{ flex: 1.5, display: 'flex', flexDirection: 'column', marginRight: '16px' }}>
                <MapContainer style={{ width: '100%', height: '100%' }} />
                {/* MapContainer에 스타일 추가 */}
                <NodeMeasurement style={{ width: '100%', height: '50%' }}/>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ccc', paddingLeft: '16px' }}>
                <LayerContainer style={{ width: '100%', height: '100%' }} />
              </Box>
            </Box>
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
}
import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { element } from 'prop-types';
import RegisterDevice from 'pages/dashboard/RegisterDevice';
import AnalyticsPage from 'pages/dashboard//Analytics/AnalyticsPage';
import SettingPage from 'pages/dashboard/Setting';
import { Analytics } from '@mui/icons-material';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

//add new page device
//const Device = Loadable(lazy(() => import('pages/device/device')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    //add device 경로
    {
      path: 'setting',
      element: <SettingPage />
    },
    {
      path: 'register',
      element: <RegisterDevice />
    },
    {
      path: 'analytics',
      element: <AnalyticsPage />
    }
  ]
};

export default MainRoutes;

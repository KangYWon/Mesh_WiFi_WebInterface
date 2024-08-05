import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

// 동적 로딩을 위한 컴포넌트
const RegisterDevice = Loadable(lazy(() => import('src/pages/dashboard/Device/RegisterDevice')));
const AnalyticsPage = Loadable(lazy(() => import('pages/dashboard/Analytics/AnalyticsPage')));
const SettingPage = Loadable(lazy(() => import('src/pages/extra-pages/Setting')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

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
    // add device 경로
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
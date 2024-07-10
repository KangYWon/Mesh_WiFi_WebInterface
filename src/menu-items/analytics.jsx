// assets
import {ChromeOutlined} from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const analytics = {
  id: 'analytics',
  title: 'Analytics',
  type: 'group',
  children: [
    {
      id: 'analytics-info',
      title: 'Analytics Info',
      type: 'item',
      url: '/analytics',
      icon: icons.ChromeOutlined
    },
  ]
};

export default analytics;

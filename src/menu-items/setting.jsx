// assets
import SettingOutlined from '@ant-design/icons/SettingOutlined';
  
  // icons
  const icons = {
    SettingOutlined
  };
  
  // ==============================|| MENU ITEMS - UTILITIES ||============================== //
  
  const setting = {
    id: 'setting',
    title: 'Setting',
    type: 'group',
    children: [
      {
        id: 'setting',
        title: 'Setting',
        type: 'item',
        url: '/setting',
        icon: icons.SettingOutlined
      }
    ]
  };
  
  export default setting;
  
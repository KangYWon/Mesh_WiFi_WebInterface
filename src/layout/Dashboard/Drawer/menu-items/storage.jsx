// assets
import { ProfileOutlined, DatabaseOutlined } from '@ant-design/icons';

// icons
const icons = {
    ProfileOutlined,
    DatabaseOutlined,
};

const storage = {
    id: 'device',
    title: 'Device',
    type: 'group',
    children: [
        {
            id: 'device',
            title: 'Device On/Off',
            type: 'item',
            url: '/register',
            icon: icons.ProfileOutlined,
            
        },
    ]
};

export default storage;
 
  

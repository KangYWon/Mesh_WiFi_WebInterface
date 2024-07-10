// api.js
import { sendMessage } from './webSocket';
import { v4 as uuidv4 } from 'uuid';

// export const fetchGpsData = () => {
//   return sendMessage('fetch_gps_table');
// };

// export const fetchNodeData = () => {
//   return sendMessage('fetch_node_table');
// };

export const fetchMeasurementData = () => {
  return sendMessage('fetch_analytics_table');
};

export const fetchDevices = () => {
  return sendMessage('fetch_device_table');
};

export const createDevice = (mac) => {
  const id = uuidv4(); // 장치 ID 생성
  return sendMessage('createDevice', { id, mac, status: false });
};

export const deleteDevice = (id) => {
  return sendMessage('deleteDevice', { id });
};
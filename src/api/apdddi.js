import axios from 'axios';
//ws 없음
const baseUrl = 'http://localhost:3000'; // 서버의 주소

const api = axios.create({
  baseURL: baseUrl,
});

export const fetchGpsData = async () => {
  try {
        const response = await api.get('/api/gps-data'); //서버의 경로 엔드포인트? 
        return response.data;
    } catch (error) {
        console.error('Error fetching GPS data:', error);
        throw error; // 예외 처리
    }
};

export const fetchNodeData = async () => {
    try {
        const response = await api.get('/api/node-data');
        return response.data;
    } catch (error) {
        console.error('Error fetching node data:', error);
        throw error; // 예외 처리
    }
  };


export const fetchDevices = () => {
  return fetch(`${baseUrl}/api/devices`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching devices:', error);
      throw error;
    });
};

export const createDevice = (mac) => {
  return fetch(`${baseUrl}/api/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mac, status: false }), // 서버에 전달할 데이터
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create device');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error creating device:', error);
      throw error;
    });
};

export const deleteDevice = (id) => {
  return fetch(`${baseUrl}/api/devices/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete device');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error deleting device:', error);
      throw error;
    });
};

export default api;

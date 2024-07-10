import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// const baseUrl = 'ws://192.168.10.67:3000/app'; // 서버의 주소
// const api = axios.create({
//   baseURL: baseUrl,
// });

let ws = new WebSocket('ws://192.168.10.154:3000/app');

ws.onopen = () => {
  console.log('WebSocket connection established');
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
  setTimeout(() => {
    ws = new WebSocket('ws://192.168.10.154:3000/app');
  }, 1000); // 1초 후 재연결 시도
};

// A map to keep track of pending promises for different types of requests
const pendingPromises = {};

// Unified message handler
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const { type, payload, error } = data;

  const responseType = type + 'Response'; // 서버에서 반환하는 응답 타입과 맞추기

  if (pendingPromises[responseType]) {
    if (type.endsWith('Success')) {
      pendingPromises[responseType].resolve(payload);
    } else if (type.endsWith('Error')) {
      pendingPromises[responseType].reject(new Error(error));
    }
    delete pendingPromises[responseType];
  }
};

// Helper function to send a message and return a promise
const sendMessage = (type, payload) => {
  return new Promise((resolve, reject) => {
    const message = { type, payload };
    pendingPromises[type + 'Response'] = { resolve, reject };
    ws.send(JSON.stringify(message));
  });
};

// GPS 데이터 가져오기 4
export const fetchGpsData = () => {
  return sendMessage('fetch_gps_table');
};

// 노드 데이터 가져오기 1
export const fetchNodeData = () => {
  return sendMessage('fetch_node_table');
};

// 측정 데이터 가져오기 2
export const fetchMeasurementData = () => {
  return sendMessage('fetch_analytics_table');
};

// 다 가져옴 0
export const fetchAllData = () => {
  return sendMessage('fetch_all_table');
};

// 장치 목록 가져오기 3
export const fetchDevices = () => {
  return sendMessage('fetch_device_table');
};

// 장치 생성
export const createDevice = (mac) => {
  const id = uuidv4(); // 장치 ID 생성
  return sendMessage('createDevice', { id, mac, status: false });
};

// 장치 삭제
export const deleteDevice = (id) => {
  return sendMessage('deleteDevice', { id });
};




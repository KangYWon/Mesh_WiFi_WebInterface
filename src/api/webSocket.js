// websocket.js

let ws = null;
const pendingPromises = {}; // 응답을 대기 중인 Promise들을 저장하는 객체
let onMessageCallback = null; // 외부에서 설정된 메시지 콜백 함수

const connectWebSocket = () => {
  ws = new WebSocket('ws://203.252.121.251:3000/web_interface_handler');

  ws.onopen = () => {
    console.log('WebSocket connection established');
    // 연결이 열릴 때마다 이벤트 핸들러 등록
    ws.onmessage = handleWebSocketMessage;
    // 초기화 메시지 전송
    sendMessage('initialize', { source: 0, destination: 0, type: 'initialize' });
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
    setTimeout(connectWebSocket, 1000); // 1초 후 재연결 시도
  };

  // 처음 연결 시에도 이벤트 핸들러 등록
  ws.onmessage = handleWebSocketMessage;
};

// WebSocket 메시지를 처리하는 함수
const handleWebSocketMessage = (event) => {
  const message = JSON.parse(event.data);
  const { type, payload } = message;
  processData({ type, payload });
  if (onMessageCallback) {
    onMessageCallback(message); //외부 콜백 호출
  }
};

// 수신한 데이터를 처리하는 함수
const processData = ({ type, payload }) => {
  const responseType = type + 'Response';
  if (pendingPromises[responseType]) {
    pendingPromises[responseType].resolve(payload); // 대기 중인 Promise를 해결
    delete pendingPromises[responseType]; // 처리된 Promise 삭제
  }
};

// WebSocket을 통해 메시지를 보내는 함수
const sendMessage = (type, payload = {}) => {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      reject(new Error('WebSocket connection not open'));
      return;
    }
    const message = { ...payload, type }; // 메시지 구성
    ws.send(JSON.stringify(message));  // 2. WebSocket을 통해 메시지 전송
    const responseType = type + 'Response'; // 3. 메시지 타입에 맞는 pending promise 등록
    pendingPromises[responseType] = { resolve, reject };
  });
};

// 외부에서 메시지 콜백을 설정하는 함수
const setOnMessageCallback = (callback) => {
  onMessageCallback = callback;
};

connectWebSocket();

export { connectWebSocket, sendMessage, setOnMessageCallback };
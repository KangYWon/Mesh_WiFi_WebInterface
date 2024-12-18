// websocket.js

let ws = null;
const pendingPromises = {}; // 응답을 대기 중인 Promise들을 저장하는 객체
const onMessageCallbacks = []; // 외부에서 설정된 메시지 콜백 함수들을 저장하는 배열

const connectWebSocket = () => {
  // ws = new WebSocket('ws://192.168.50.213:3000/web_interface_handler');
  ws = new WebSocket('ws://172.18.128.173:3000/web_interface_handler');

  ws.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
    // 연결이 닫히면 재연결 시도
    //setTimeout(connectWebSocket, 5000);
  };

  ws.onmessage = (event) => {
    handleWebSocketMessage(event);
  };
};

// WebSocket 메시지를 처리하는 함수
const handleWebSocketMessage = (event) => {
  const message = JSON.parse(event.data);
  const { type, ...payload } = message;
  console.log('Received message:', message); // 수신한 메시지 로그 출력
  processData({ type, payload }); //받은 메시지 처리
  callOnMessageCallbacks(message); //등록된 모든 메시지 콜백들 호출
  
};

// 수신한 데이터를 처리하는 함수
const processData = ({ type, payload }) => {
  const responseType = type + 'Response';
  if (pendingPromises[responseType]) {
    pendingPromises[responseType].resolve(payload); // 대기 중인 Promise를 해결
    delete pendingPromises[responseType]; // 처리된 Promise 삭제
  } else {
    console.warn(`No pending promise found for response type: ${responseType}`);
  }
};

// 외부에서 메시지 콜백을 설정하는 함수
const setOnMessageCallback = (callback) => {
  if (typeof callback === 'function') {
    onMessageCallbacks.push(callback);
  } else {
    console.error('Callback is not a function');
  }
};

// 메시지 콜백들을 호출하는 함수
const callOnMessageCallbacks = (message) => {
  onMessageCallbacks.forEach(callback => {
    callback(message);
  });
};

// WebSocket을 통해 메시지를 보내는 함수
const sendMessage = (type, payload = {}) => {
  return new Promise((resolve, reject) => {
    // 3초 딜레이 추가
    setTimeout(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket connection not open'));
        return;
      }

      const message = { ...payload, type }; // 메시지 구성
      console.log('Sending message to server:', message); // 서버로 보낼 메시지 로그 출력
      ws.send(JSON.stringify(message));  // WebSocket을 통해 메시지 전송

      const responseType = type + 'Response'; // 메시지 타입에 맞는 pending promise 등록
      pendingPromises[responseType] = { resolve, reject };

      // 10초 후에 응답이 없으면 타임아웃 처리
      setTimeout(() => {
        if (pendingPromises[responseType]) {
          reject(new Error('Response timeout'));
          delete pendingPromises[responseType];
        }
      }, 10000);
    }, 1000); // 3초 딜레이
  });
};

connectWebSocket();

export { connectWebSocket, sendMessage, setOnMessageCallback };
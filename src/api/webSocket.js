// websocket.js

let ws = null;
const pendingPromises = {}; // 응답을 대기 중인 Promise들을 저장하는 객체
const onMessageCallbacks = []; // 외부에서 설정된 메시지 콜백 함수들을 저장하는 배열

const connectWebSocket = () => {
  ws = new WebSocket('ws://203.252.121.251:3000/web_interface_handler');

  ws.onopen = () => {
    console.log('WebSocket connection established');
  
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  ws.onmessage = (event) => {
    handleWebSocketMessage(event);
  };
};

// WebSocket 메시지를 처리하는 함수
const handleWebSocketMessage = (event) => {
  const message = JSON.parse(event.data);
  const { type, payload } = message;
  processData({ type, payload }); //받은 메시지 처리
  callOnMessageCallbacks(message); //등록된 모든 메시지 콜백들 호출
  
};

// 수신한 데이터를 처리하는 함수
const processData = ({ type, payload }) => {
  const responseType = type + 'Response';
  if (pendingPromises[responseType]) {
    pendingPromises[responseType].resolve(payload); // 대기 중인 Promise를 해결
    delete pendingPromises[responseType]; // 처리된 Promise 삭제
  }
};

// 외부에서 메시지 콜백을 설정하는 함수
const setOnMessageCallback = (callback) => {
  if (typeof callback === 'function') {
    onMessageCallbacks.push(callback);
  } else {
    //console.error('Callback is not a function');
  }
};
// const setOnMessageCallback = (callback) => {
//   onMessageCallbacks.push(callback);
// };

// 메시지 콜백들을 호출하는 함수
const callOnMessageCallbacks = (message) => {
  onMessageCallbacks.forEach(callback => {
    callback(message);
  });
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

connectWebSocket();

export { connectWebSocket, sendMessage, setOnMessageCallback };
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Box } from '@mui/material';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';
import 'leaflet/dist/leaflet.css';
import 'leaflet-arrowheads';

// Default center coordinates
const center = [36.103774, 129.388557];

// // 하드코딩된 노드와 연결 데이터
// const testNodes = [
//   { latitude: 36.1033053, longitude: 129.3870186, seq: '1', layer: '1', myMac: '00:1A:2B:3C:4D:5E', parentMac: '' },
//   { latitude: 36.1036842, longitude: 129.3874188, seq: '2', layer: '2', myMac: '00:1A:2B:3C:4D:6E', parentMac: '00:1A:2B:3C:4D:5E' },
//   { latitude: 36.1040540, longitude: 129.3886542, seq: '3', layer: '2', myMac: '00:1A:2B:3C:4D:7E', parentMac: '00:1A:2B:3C:4D:5E' },
//   { latitude: 36.1028429, longitude: 129.3861420, seq: '4', layer: '3', myMac: '00:1A:2B:3C:4D:8E', parentMac: '00:1A:2B:3C:4D:6E' },
// //   { latitude: 36.1034352, longitude: 129.3857841, seq: '5', layer: '3', myMac: '00:1A:2B:3C:4D:9E', parentMac: '00:1A:2B:3C:4D:7E' },
// //   { latitude: 36.10379,   longitude: 129.3917,    seq: '6', layer: '3', myMac: '00:1A:2B:3C:4D:9A', parentMac: '00:1A:2B:3C:4D:7E' },
// //   { latitude: 36.10428,   longitude: 129.3860,    seq: '7', layer: '4', myMac: '00:1A:2B:3C:4D:9B', parentMac: '00:1A:2B:3C:4D:9E' }
// ];

const MapContainerComponent = ({ selectedNode, onNodeClick = () => {} }) => {
  // const [nodes] = useState(testNodes); // 기본적으로 하드코딩된 데이터 사용
  // const [connections] = useState(testNodes
  //   .filter(node => node.parentMac) // ParentMac이 있는 노드만 필터링
  //   .map(node => ({
  //     from: node.myMac,
  //     to: node.parentMac
  //   }))
  // );
  const [nodes] = useState([]); // 기본적으로 하드코딩된 데이터 사용
  const [connections, setConnections] = useState([]); // 연결 데이터
  const [openedPopupNode, setOpenedPopupNode] = useState(null);

  useEffect(() => {
    console.log('Opened Popup Node:', openedPopupNode);
  }, [openedPopupNode]);

  useEffect(() => {
    const handleWebSocketMessage = (message) => {
        if (message.type === 'fetch_gps') {
            const nodeDataFromServer = message.data;
            setNodes(nodeDataFromServer);

           // 연결 데이터 생성
          const connections = nodeDataFromServer
          .filter(node => node.parentMac) // ParentMac이 있는 노드만 필터링
          .map(node => ({
            from: node.myMac,
            to: node.parentMac
          }));

        setConnections(connections);
      }
    };
    // WebSocket 콜백 설정
    setOnMessageCallback(handleWebSocketMessage);
    // 초기 메시지 전송
    //sendMessage('fetch_gps', { type: 'fetch_gps' });

    // 컴포넌트 언마운트 시 콜백 해제
    return () => {
        setOnMessageCallback(null);
    };
  }, []);

  const layerColors = {
    //레이어 색상 설정
    1: 'red',
    2: 'orange',
    3: '#ffff5e',
    4: 'green',
    5: 'sky',
    6: 'blue',
    7: 'purple',
    8: 'pink',
    9: 'brown',
    10: 'gray',
    11: 'white'
  };

  const ArrowheadPolyline = ({ positions, color }) => {
    const map = useMap();

    useEffect(() => {
      // Create polyline
      const polyline = L.polyline(positions, { color, weight: 2 }).addTo(map);

      // Add arrowheads
      const arrowheads = L.polyline(positions, { color })
        .arrowheads({
          size: '15px',
          frequency: 'end',
          yawn: 60
        })
        .addTo(map);

      // Cleanup function
      return () => {
        map.removeLayer(polyline);
        map.removeLayer(arrowheads);
      };
    }, [map, positions, color]);

    return null;
  };

  return (
    <Box sx={{ flex: 1, border: '1px solid black' }}>
      <MapContainer center={center} zoom={17} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {nodes.map(node => (
          <CircleMarker
            key={node.seq + (openedPopupNode?.seq === node.seq ? '-selected' : '')}
            center={[node.latitude, node.longitude]}
            radius={15}
            color={openedPopupNode?.seq === node.seq ? 'black' : layerColors[node.layer]}
            fillColor={openedPopupNode?.seq === node.seq ? layerColors[node.layer] : layerColors[node.layer]}
            fillOpacity={openedPopupNode?.seq === node.seq ? 1 : 0.4}
            eventHandlers={{
              click: () => {
                setOpenedPopupNode(node); 
              },
              popupclose: () => {
                setOpenedPopupNode(null);
              }
            }}
          >
          <Popup>
            Node : {node.seq}<br /> Layer: {node.layer}<br />Parent MAC: {node.parentMac}<br />My MAC: {node.myMac}
          </Popup>
          </CircleMarker>
        ))}
        {connections.map((conn, index) => {
          const fromNode = nodes.find(node => node.myMac === conn.from);
          const toNode = nodes.find(node => node.myMac === conn.to);
          if (!fromNode || !toNode) return null;
          const latlngs = [
            [fromNode.latitude, fromNode.longitude],
            [toNode.latitude, toNode.longitude]
          ];
          return (
            <React.Fragment key={index}>
              <ArrowheadPolyline positions={latlngs} color="black" />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default MapContainerComponent;
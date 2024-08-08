import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Box } from '@mui/material';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';
import 'leaflet/dist/leaflet.css';
import 'leaflet-arrowheads';
import L from 'leaflet';  // Import Leaflet library
import picture from 'src/assets/images/icons/Layer_Color.png'; // Import the image
import toggleIcon from 'src/assets/images/icons/nodes2.png';

// Default center coordinates
const center = [36.103774, 129.388557];

const CustomControl = ({ toggleImage }) => {
  const map = useMap();
  
  useEffect(() => {
    const control = L.control({ position: 'topleft' }); // Change position as needed
    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      div.innerHTML = `
        <button style="width: 30px; height: 30px; background: white; border: none; display: flex; justify-content: center; align-items: center;">
          <img src="${toggleIcon}" alt="Toggle" style="width: 20px; height: 20px;" />
        </button>
      `;
      div.onclick = toggleImage;
      return div;
    };
    control.addTo(map);

    // Cleanup function
    return () => {
      control.remove();
    };
  }, [map, toggleImage]);

  return null;
};

const MapContainerComponent = ({ selectedNode, onNodeClick = () => {} }) => {
  const [nodes, setNodes] = useState([]); 
  const [connections, setConnections] = useState([]); 
  const [openedPopupNode, setOpenedPopupNode] = useState(null);
  const [showImage, setShowImage] = useState(false);

  const toggleImage = () => {
    setShowImage(!showImage);
  };

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
            .filter(node => node.parent_mac) // ParentMac이 있는 노드만 필터링
            .map(node => ({
              from: node.my_mac,
              to: node.parent_mac
            }));

          setConnections(connections);
        }
    };
    // WebSocket 콜백 설정
    setOnMessageCallback(handleWebSocketMessage);
    // 초기 메시지 전송
    sendMessage('fetch_gps', { type: 'fetch_gps' });

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
        <CustomControl toggleImage={toggleImage} />
        {nodes.map(node => (
          <CircleMarker
            key={`${node.seq}-${node.my_mac}`} // seq와 my_mac 조합으로 고유한 key 생성
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
              Node : {node.seq}<br /> Layer: {node.layer}<br />Parent MAC: {node.parent_mac}<br />My MAC: {node.my_mac}
            </Popup>
          </CircleMarker>
        ))}
        {connections.map((conn) => {
          const fromNode = nodes.find(node => node.my_mac === conn.from);
          const toNode = nodes.find(node => node.my_mac === conn.to);
          if (!fromNode || !toNode) return null;
          const latlngs = [
            [fromNode.latitude, fromNode.longitude],
            [toNode.latitude, toNode.longitude]
          ];
          const connectionKey = `${conn.from}-${conn.to}`; // 고유한 key 생성
          return (
            <React.Fragment key={connectionKey}>
              <ArrowheadPolyline positions={latlngs} color="black" />
            </React.Fragment>
          );
        })}
        {showImage && (
          <img 
            src={picture}
            alt="Overlay" 
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '170px',
              height: '235px',
              zIndex: 999
            }}
          />
        )}
      </MapContainer>
    </Box>
  );
};

export default MapContainerComponent;
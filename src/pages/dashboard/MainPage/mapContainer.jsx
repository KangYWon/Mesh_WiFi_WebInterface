import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Box } from '@mui/material';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';
import 'leaflet/dist/leaflet.css';
import 'leaflet-arrowheads';
import L from 'leaflet'; // Import Leaflet library
import picture from 'src/assets/images/icons/Layer_Color.png'; // Import the image
import toggleIcon from 'src/assets/images/icons/nodes2.png';

// Default center coordinates
const center = [36.103774, 129.388557];

const CustomControl = ({ toggleImage }) => {
  const map = useMap();

  useEffect(() => {
    const control = L.control({ position: 'topleft' });
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

    return () => {
      control.remove();
    };
  }, [map, toggleImage]);

  return null;
};

const ArrowheadPolyline = ({ positions, initialColor }) => {
  const map = useMap();
  const [color, setColor] = useState(initialColor); // 초기 색상 상태

  useEffect(() => {
    // 함수 내에서 줌 레벨에 따라 색상 및 굵기 변경
    const updatePolyline = () => {
      const zoom = map.getZoom();
      const newColor = zoom > 14 ? 'black' : 'black'; // 줌 레벨에 따른 색상 설정 (일단 둘다 검정으로 해둠 )
      const newWeight = zoom > 14 ? 0.01 : 2; // 줌 레벨에 따른 굵기 설정

      setColor(newColor); // 색상 상태 업데이트

      // 기존 폴리라인 제거 후 새로 그리기
      const polyline = L.polyline(positions, { color: newColor, weight: newWeight }).addTo(map);
      const arrowheads = L.polyline(positions, { color: newColor })
        .arrowheads({ size: '15px', frequency: 'end', yawn: 60 })
        .addTo(map);

      // 클린업 함수로 기존 레이어 제거
      return () => {
        map.removeLayer(polyline);
        map.removeLayer(arrowheads);
      };
    };

    // 초기 폴리라인 생성
    const cleanup = updatePolyline();

    // 줌 레벨이 변경될 때마다 폴리라인 및 굵기 업데이트
    map.on('zoomend', updatePolyline);

    // 컴포넌트 언마운트 시 이벤트 제거 및 레이어 삭제
    return () => {
      map.off('zoomend', updatePolyline);
      cleanup();
    };
  }, [map, positions]);

  return null;
};

const MarkerComponent = ({ node, openedPopupNode, setOpenedPopupNode, layerColors }) => {
  const map = useMap();
  const zoom = map.getZoom();
  const radius = zoom > 12 ? 8 : zoom > 11 ? 13 : 15;

  return (
    <CircleMarker
      key={`${node.seq}-${node.my_mac}`}
      center={[node.latitude, node.longitude]}
      radius={radius}
      color={openedPopupNode?.seq === node.seq ? 'black' : layerColors[node.layer]}
      fillColor={openedPopupNode?.seq === node.seq ? layerColors[node.layer] : layerColors[node.layer]}
      fillOpacity={openedPopupNode?.seq === node.seq ? 1 : 0.4}
      eventHandlers={{
        click: () => setOpenedPopupNode(node),
        popupclose: () => setOpenedPopupNode(null)
      }}
    >
      <Popup>
        Node : {node.seq}<br /> Layer: {node.layer}<br />Parent MAC: {node.parent_mac}<br />My MAC: {node.my_mac}
      </Popup>
    </CircleMarker>
  );
};

const MapContainerComponent = () => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [openedPopupNode, setOpenedPopupNode] = useState(null);
  const [showImage, setShowImage] = useState(false);

  const toggleImage = () => setShowImage(!showImage);

  const layerColors = {
    1: 'red', 2: 'orange', 3: '#ffff5e', 4: 'green', 5: 'sky',
    6: 'blue', 7: 'purple', 8: 'pink', 9: 'brown', 10: 'gray', 11: 'white'
  };
  useEffect(() => {
    const handleWebSocketMessage = (message) => {
      if (message.type === 'fetch_gps') {
        const nodeDataFromServer = message.data;

        if (nodeDataFromServer.length > 0) {
          nodeDataFromServer[0].latitude = 36.10332;
          nodeDataFromServer[0].longitude = 129.3869;

          nodeDataFromServer[1].latitude = 36.10373; 
          nodeDataFromServer[1].longitude = 129.3869;

          nodeDataFromServer[2].latitude = 36.10358; 
          nodeDataFromServer[2].longitude = 129.3866;

          nodeDataFromServer[3].latitude = 36.10369; 
          nodeDataFromServer[3].longitude = 129.3871;

          nodeDataFromServer[4].latitude = 36.10355; 
          nodeDataFromServer[4].longitude = 129.3875;
          
          nodeDataFromServer[5].latitude = 36.10329; 
          nodeDataFromServer[5].longitude = 129.3877;

          nodeDataFromServer[6].latitude = 36.10324; 
          nodeDataFromServer[6].longitude = 129.3884;

          nodeDataFromServer[7].latitude = 36.10289; 
          nodeDataFromServer[7].longitude = 129.3881;

        }
        
        setNodes(nodeDataFromServer);
        setConnections(nodeDataFromServer
          .filter(node => node.parent_mac)
          .map(node => ({
            from: node.my_mac,
            to: node.parent_mac
          }))
        );
      }
    };
    
    setOnMessageCallback(handleWebSocketMessage);
    sendMessage('fetch_gps', { type: 'fetch_gps' });

    return () => setOnMessageCallback(null);
  }, []);

  return (
    <Box sx={{ flex: 1, border: '1px solid black' }}>
      <MapContainer center={center} zoom={17} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <CustomControl toggleImage={toggleImage} />
        {nodes.map(node => (
          <MarkerComponent
            key={node.my_mac}
            node={node}
            openedPopupNode={openedPopupNode}
            setOpenedPopupNode={setOpenedPopupNode}
            layerColors={layerColors}
          />
        ))}
        {connections.map((conn) => {
          const fromNode = nodes.find(node => node.my_mac === conn.from);
          const toNode = nodes.find(node => node.my_mac === conn.to);
          if (!fromNode || !toNode) return null;
          
          const latlngs = [
            [fromNode.latitude, fromNode.longitude],
            [toNode.latitude, toNode.longitude]
          ];
          
          return (
            <ArrowheadPolyline
              key={`${conn.from}-${conn.to}`}
              positions={latlngs}
              color="black"
            />
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
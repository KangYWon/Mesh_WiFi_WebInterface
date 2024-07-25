import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import { Box } from '@mui/material';

// Default center coordinates
const center = [36.103774, 129.388557];

// 하드코딩된 노드와 연결 데이터
const testNodes = [
  { id: 1, latitude: 36.1033053, longitude: 129.3870186, label: 'Node 1', myMac: '00:1A:2B:3C:4D:5E', parentMac: '' },
  { id: 2, latitude: 36.1036842, longitude: 129.3874188, label: 'Node 2', myMac: '00:1A:2B:3C:4D:6E', parentMac: '00:1A:2B:3C:4D:5E' },
  { id: 3, latitude: 36.1040540, longitude: 129.3886542, label: 'Node 3', myMac: '00:1A:2B:3C:4D:7E', parentMac: '00:1A:2B:3C:4D:5E' },
  { id: 4, latitude: 36.1028429,  longitude: 129.3861420, label: 'Node 4', myMac: '00:1A:2B:3C:4D:8E', parentMac: '00:1A:2B:3C:4D:6E' },
  { id: 5, latitude: 36.1034352,  longitude: 129.3857841, label: 'Node 5', myMac: '00:1A:2B:3C:4D:9E', parentMac: '00:1A:2B:3C:4D:7E' }
];

const MapContainerComponent = ({ selectedNode, onNodeClick }) => {
  const [nodes] = useState(testNodes); // 기본적으로 하드코딩된 데이터 사용
  const [connections] = useState(testNodes
    .filter(node => node.parentMac) // ParentMac이 있는 노드만 필터링
    .map(node => ({
      from: node.myMac,
      to: node.parentMac
    }))
  );

  return (
    <Box sx={{ flex: 1, border: '1px solid black' }}>
      <MapContainer center={center} zoom={17} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {nodes.map(node => (
          <CircleMarker
            key={node.id}
            center={[node.latitude, node.longitude]}
            radius={10}
            color={node.id === (selectedNode && selectedNode.id) ? 'yellow' : 'blue'}
            fillColor={node.id === (selectedNode && selectedNode.id) ? 'yellow' : 'blue'}
            fillOpacity={0.5}
            eventHandlers={{
              click: () => {
                onNodeClick(node);
              },
            }}
          >
            <Popup>
              {node.label}<br />MAC: {node.myMac}<br />Parent MAC: {node.parentMac}
            </Popup>
          </CircleMarker>
        ))}
        {connections.map((conn, index) => {
          const fromNode = nodes.find(node => node.myMac === conn.from);
          const toNode = nodes.find(node => node.myMac === conn.to);
          console.log(`Rendering Polyline from ${conn.from} to ${conn.to}`); // 연결된 노드의 MAC 주소
          if (!fromNode || !toNode) {
            console.log('Skipping Polyline rendering due to missing nodes:', conn);
            return null;
          }
          console.log(`Polyline positions: [${fromNode.latitude}, ${fromNode.longitude}] -> [${toNode.latitude}, ${toNode.longitude}]`); // Polyline 좌표 출력
          return (
            <Polyline
              key={index}
              positions={[
                [fromNode.latitude, fromNode.longitude],
                [toNode.latitude, toNode.longitude]
              ]}
              color="blue"
            />
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default MapContainerComponent;
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';

import Box from '@mui/material/Box';

const center = [36.103774, 129.388557]; // Default center coordinates

const MapContainerComponent = ({ nodes = [], connections = [], selectedNode, onNodeClick }) => {
    const layerColors = {
        //레이어 색상 설정
        1: 'red',
        2: 'orange',
        3: 'yellow',
        4: 'green',
        5: 'sky',
        6: 'blue',
        7: 'purple',
        8: 'pink',
        9: 'brown',
        10: 'gray',
        11: 'black'
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
                        key={node.id} // 노드의 고유 ID를 키로 사용
                        center={[node.latitude, node.longitude]} // 노드의 위치 설정
                        radius={10} // 마커의 반지름
                        // 선택된 노드는 노란색, 나머지는 레이어에 따른 색상
                        color={node.id === (selectedNode && selectedNode.id) ? 'yellow' : (layerColors[node.layer] || 'blue')}
                        fillColor={node.id === (selectedNode && selectedNode.id) ? 'yellow' : (layerColors[node.layer] || 'blue')}
                        fillOpacity={0.5} // 채음 불투명도
                        eventHandlers={{
                            click: () => {
                                onNodeClick(node); // 노드 클릭 시 실행할 함수
                            },
                        }}
                    >
                        <Popup> 
                            {node.label}<br />Current Layer {node.layer}
                        </Popup>
                    </CircleMarker>
                ))}
                {connections.map((conn, index) => {
                    const fromNode = nodes.find(node => node.id === conn.from);
                    const toNode = nodes.find(node => node.id === conn.to);
                    if (!fromNode || !toNode) return null;
                    return (
                        <Polyline
                            key={index}
                            positions={[[fromNode.latitude, fromNode.longitude], [toNode.latitude, toNode.longitude]]}
                            color="blue"
                        />
                    );
                })}
            </MapContainer>
        </Box>
    );
};

export default MapContainerComponent;
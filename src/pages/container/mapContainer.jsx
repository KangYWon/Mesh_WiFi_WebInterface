import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';

const center = [36.103774, 129.388557]; // Default center coordinates

const MapContainerComponent = ({ nodes = [], connections = [], selectedNode, onNodeClick }) => {
    const layerColors = {
        //레이어 색상 설정
        1: 'red',
        2: 'green'
    };

    return (
        <Box sx={{ flex: 2, border: '1px solid black' }}>
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
                        color={node.id === (selectedNode && selectedNode.id) ? 'yellow' : (layerColors[node.layer] || 'blue')}
                        fillColor={node.id === (selectedNode && selectedNode.id) ? 'yellow' : (layerColors[node.layer] || 'blue')}
                        fillOpacity={0.5}
                        eventHandlers={{
                            click: () => {
                                onNodeClick(node);
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
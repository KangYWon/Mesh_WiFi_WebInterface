import React, { useEffect, useState } from 'react';
import MapContainer from './mapContainer';
import LayerContainer from './layerContainer';
import { setOnMessageCallback } from '/src/api/webSocket'
import { fetchNodeData } from '/src/api/api';

const App = () => {
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    useEffect(() => {
         // 웹소켓 메시지 콜백 설정
         setOnMessageCallback((type, payload) => {
            if (type === 'nodeData') {
                setNodes(payload.nodes || []);
                setConnections(payload.connections || []);
            }
        });
    }, []);

    const handleNodeClick = (node) => {
        setSelectedNode(node);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1 }}>
                <MapContainer 
                    nodes={nodes} 
                    connections={connections} 
                    selectedNode={selectedNode}
                    onNodeClick={handleNodeClick} 
                />
            </div>
            <div style={{ flex: 1 }}>
                <LayerContainer 
                    nodes={nodes} 
                    selectedNode={selectedNode} 
                    onNodeClick={handleNodeClick} 
                />
            </div>
        </div>
    );
};

export default App;
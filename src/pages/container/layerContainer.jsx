// LayerContainer.js
import React, { useState, useEffect } from 'react';
import CircularStatic from "components/CircularStatic";
import Tree from 'react-d3-tree';
import { setOnMessageCallback } from 'src/api/webSocket.js';
import Latency from 'src/pages/dashboard/Analytics/Latency.jsx';
import Throughput from 'src/pages/dashboard/Analytics/Throughput.jsx';
import NodeMeasurement from './nodeMeasurement';

//import { setOnMessageCallback } from 'src/api/webSocket.js';

const LayerContainer = () => {
    const [treeData, setTreeData] = useState(null);
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        const handleWebSocketMessage = (message) => {
            try {
                if (message.type === 'fetch_node') {
                    console.log('from fetch_node');
                    const transformedData = transformDataForD3(message.data);
                    setTreeData(transformedData);
                    setNodes(message.data);
                } else {
                    console.error('Unexpected message type:', message.type);
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };

        // WebSocket 메시지 핸들러 설정
        setOnMessageCallback(handleWebSocketMessage);

        // Cleanup function for useEffect
        return () => {
            setOnMessageCallback(null); // Remove the callback when unmounting
        };
    }, []);

    const transformDataForD3 = (nodesData) => {
        const root = {
            name: 'Router',
            children: []
        };

        // Map to store nodes by my_mac for efficient lookup
        const nodeMap = {};

        nodesData.forEach((node) => {
            const newNode = {
                name: `Node ${node.seq}`,
                attributes: {
                    seq: node.seq,
                    layer: node.layer,
                    parentMac: node.parent_mac,
                    myMac: node.my_mac
                },
                children: []
            };
            nodeMap[node.my_mac] = newNode;
        });

        nodesData.forEach((node) => {
            const currentNode = nodeMap[node.my_mac];
            const parentNode = nodeMap[node.parent_mac]; // Get parent node from nodeMap
            if (parentNode) {
                parentNode.children.push(currentNode);
            } else {
                root.children.push(currentNode); // If parent not found, consider as root node
            }
        });

        return root;
    };

    return (
        <div style={{ height: '100vh' }}>
            <h1>Tree Topology</h1>
            <div id="tree-container" style={{ width: '100%', height: '100%' }}>
                {treeData ? (
                    <Tree
                        data={treeData}
                        orientation="vertical"
                        translate={{ x: 50, y: 50 }}
                        nodeSize={{ x: 200, y: 200 }}
                        separation={{ siblings: 1, nonSiblings: 2 }}
                        pathFunc="diagonal"
                        shouldCollapseNeighborNodes={true}
                    />
                ) : (
                    <CircularStatic /> 
                )}
            </div>
            <div style={{ width: '100%', height: '50%' }}>
                <Latency nodes={nodes} /> {/* Latency 컴포넌트에 노드 데이터를 전달 */}
            </div>
            <div style={{ width: '100%', height: '50%' }}>
                <Throughput nodes={nodes} /> {/* Throughput 컴포넌트에 노드 데이터를 전달 */}
            </div>
            <div style={{ width: '100%', height: '50%' }}>
                <NodeMeasurement nodes={nodes} /> {/* nodeMeasurement 컴포넌트에 노드 데이터를 전달 */}
            </div> 
         </div>
    );
};

export default LayerContainer;
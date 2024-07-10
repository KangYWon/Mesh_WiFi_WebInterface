// LayerContainer.js
import React, { useState, useEffect } from 'react';
import CircularStatic from "components/CircularStatic";
import Tree from 'react-d3-tree';
import { setOnMessageCallback } from 'src/api/webSocket.js';

//import { setOnMessageCallback } from 'src/api/webSocket.js';

const LayerContainer = () => {
    const [treeData, setTreeData] = useState(null);

    useEffect(() => {
        const handleWebSocketMessage = (message) => {
            if (message.type === 'nodeData') {
                //setNodeData(message.data);
                const transformedData = transformDataForD3(message.data);
                setTreeData(transformedData);
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
            // if (node.parent_mac !== '') {
            //     const parentNode = nodeMap[node.parent_mac];
            //     if (parentNode) {
            //         parentNode.children.push(currentNode);
            //     } else {
            //         root.children.push(currentNode); // If parent not found, consider as root node
            //     }
            // } else {
            //     root.children.push(currentNode); // If no parent_mac, consider as root node
            // }
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
            <h1>WebSocket Client</h1>
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
        </div>
    );
};

export default LayerContainer;
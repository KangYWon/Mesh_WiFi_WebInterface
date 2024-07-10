import React, { useState, useEffect } from 'react';
import Tree from "react-d3-tree";
import Box from '@mui/material/Box';
import CircularStatic from "components/CircularStatic";
import Modal from '@mui/material/Modal'; // Material-UI의 Modal을 사용
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { fetchMeasurementData } from '/src/api/api';
import { setOnMessageCallback } from '/src/api/webSocket';

const LayerContainer = ({ selectedNode, onNodeClick }) => {
    const [secondNode, setSecondNode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [measurementResult, setMeasurementResult] = useState(null);
    const [clickCount, setClickCount] = useState(0);
    const [treeData, setTreeData] = useState(null);

    useEffect(() => {
        const handleWebSocketMessage = (message) => {
            if (message.type === 'nodeData') {
                const transformedData = transformDataForD3(message.data);
                setTreeData(transformedData);
            }
        };
    
        setOnMessageCallback(handleWebSocketMessage);
    
        // Cleanup function for useEffect
        return () => {
            setOnMessageCallback(null); // Remove the callback when unmounting
        };
    }, []);

    const transformDataForD3 = (nodesData) => {
        const map = {}; // 노드들을 임시로 저장하기 위한 객체
        // 각 노드를 순회하면서 map 객체에 저장
        nodesData.forEach((node) => {
            map[node.myMac] = { 
                id: node.seq,
                name: `Node ${node.seq}`, 
                attributes: {
                    seq: node.seq,
                    layer: node.layer,
                    parentMac: node.parentMac,
                    myMac: node.myMac
                },
                children: [] // 자식 노드들을 저장할 배열
            };
        });
    
        const tree = [];
        nodesData.forEach((node) => {
            if (node.parentMac === '00:00:00:00:00:00' || !map[node.parentMac]) {
                tree.push(map[node.myMac]);
            } else {
                map[node.parentMac].children.push(map[node.myMac]);
            }
        });
    
        return tree;
    };

    const handleNodeClick = (nodeDatum) => {
        if (!selectedNode || (selectedNode && selectedNode.id === nodeDatum.id)) {
            onNodeClick(nodeDatum);
            setSecondNode(null); // 두 번째 노드 초기화
            setClickCount(prevCount => {
                const newCount = prevCount + 1;
                if (newCount === 3) {
                    // 세 번 클릭하면 초기화
                    onNodeClick(null);
                    setSecondNode(null);
                    return 0;
                }
                return newCount;
            });
        } else if (selectedNode && selectedNode.id !== nodeDatum.id && !secondNode) {
            // 다른 노드를 클릭하여 두 번째 노드를 선택한 경우
            setSecondNode(nodeDatum);
            setIsModalOpen(true); // 팝업 창 열기
            setClickCount(0); // 클릭 횟수 초기화
        } else {
            // 새로운 첫 번째 노드를 선택하는 경우
            onNodeClick(nodeDatum);
            setSecondNode(null); // 두 번째 노드 초기화
            setClickCount(1); // 첫 번째 클릭으로 설정
        }
    };

    const handleMeasurement = async (type) => {
        setIsModalOpen(false);
        if (selectedNode && secondNode) {
            try {
                const data = await fetchMeasurementData(selectedNode.id, secondNode.id, type);
                setMeasurementResult(data); // 측정 결과 저장
            } catch (error) {
                console.error('Error fetching measurement data:', error);
            }
        }
    };

    const renderCustomNodeElement = ({ nodeDatum }) => (
        <g onClick={() => handleNodeClick(nodeDatum)}>
            <circle r="10" fill={nodeDatum.id === (selectedNode && selectedNode.id) ? 'yellow' : 'steelblue'} />
            <text x="-10" y="20" fill="white" textAnchor="middle">{nodeDatum.name}</text>
        </g>
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1 }}>
                <Box sx={{ border: '1px solid black', height: '100%', overflow: 'auto', padding: 2 }}>
                    {!treeData ? (
                        <CircularStatic /> 
                    ) : (
                        <pre>{JSON.stringify(treeData, null, 2)}</pre>
                        // <Tree
                        //     data={treeData}
                        //     orientation="vertical"
                        //     translate={{ x: window.innerWidth / 2, y: 50 }}
                        //     nodeSize={{ x: 200, y: 200 }}
                        //     separation={{ siblings: 1, nonSiblings: 2 }}
                        //     pathFunc="diagonal"
                        //     renderCustomNodeElement={renderCustomNodeElement}
                        //     style={{ width: '100%', height: '100%' }}
                        // />
                    )}
                </Box>
            </div>
            
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="measurement-modal-title"
                aria-describedby="measurement-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <Typography id="measurement-modal-title" variant="h6" component="h2">
                        Choose Measurement Type
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => handleMeasurement('latency')}>
                        Latency
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleMeasurement('throughput')}>
                        Throughput
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default LayerContainer;

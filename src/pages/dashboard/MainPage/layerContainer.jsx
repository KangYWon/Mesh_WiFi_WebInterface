import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress'; // 로딩 애니메이션 추가
import Tree from 'react-d3-tree';
import { sendMessage, setOnMessageCallback } from 'src/api/webSocket.js';

const LayerContainer = () => {
    const [treeData, setTreeData] = useState(null); // 트리 데이터
    const [totalNodes, setTotalNodes] = useState(0); // 총 노드 수
    const [loading, setLoading] = useState(true); // 로딩 상태

    useEffect(() => {
        const handleWebSocketMessage = (message) => {
            try {
                if (message.type === 'fetch_node') {
                    console.log('from fetch_node');
                    const transformedData = transformDataForD3(message.data);
                    setTreeData(transformedData);
                    setTotalNodes(message.data.length + 1); // 총 노드 수 = seq + 1로 계산
                    setLoading(false); // 로딩 완료
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
                setLoading(false); // 오류 발생 시 로딩 해제
            }
        };

        // WebSocket 메시지 핸들러 설정
        setOnMessageCallback(handleWebSocketMessage);

        // WebSocket 연결이 열리면 초기화 메시지를 보냅니다.
        sendMessage('fetch_node', { type: 'fetch_node' });

        return () => {
            setOnMessageCallback(null); // 컴포넌트 언마운트 시 콜백 제거
        };
    }, []);

    // 트리 데이터를 변환하는 함수
    const transformDataForD3 = (nodesData) => {
        const root = {
            name: 'Router',
            children: []
        };

        // 각 노드를 저장할 맵 (효율적인 검색을 위해)
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
            const parentNode = nodeMap[node.parent_mac]; // 부모 노드 찾기
            if (parentNode) {
                parentNode.children.push(currentNode);
            } else {
                root.children.push(currentNode); // 부모가 없는 노드는 루트로 간주
            }
        });

        return root;
    };

    return (
        <div style={{ height: '100vh', position: 'relative', padding: '20px' }}>
            
            {/* Tree Topology와 Total Node를 포함하는 상자 */}
            <div style={{ 
                position: 'absolute', 
                left: '30px', 
                top: '10px', 
                display: 'flex', 
                flexDirection: 'column', // 위아래 배치
                alignItems: 'flex-start', //center
                // backgroundColor: '#EFEFEF', // 회색 배경
                padding: '20px', // 상자 안쪽 여백
                borderRadius: '8px', // 둥근 모서리
                // boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' // 약간의 그림자 추가
            }}>
                {/* Tree Topology 타이틀 */}
                <h1 style={{ margin: '0', fontSize: '30px', fontWeight: 'bold' }}>Tree Topology</h1>
    
                {/* Total Node 표시 */}
                <div style={{ 
                    marginTop: '0px', 
                    display: 'flex', 
                    alignItems: 'center',
                }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Total node: </span>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        marginLeft: '10px', 
                        borderRadius: '8px', // 사각형을 둥글게
                        // backgroundColor: '#e0e0e0', // 사각형 내부 회색 배경
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center' // 중앙 정렬
                    }}>
                        {loading ? <CircularProgress size={25} sx={{ color: 'green' }} /> : totalNodes}
                    </div>
                </div>
            </div>
    
            {/* 트리 데이터가 있을 때만 트리 그리기 */}
            <div id="tree-container" style={{ width: '100%', height: '100%' }}>
                {treeData ? (
                    <Tree
                        data={treeData}
                        orientation="vertical"
                        translate={{ x: 210, y: 150 }}
                        nodeSize={{ x: 200, y: 200 }}
                        separation={{ siblings: 1, nonSiblings: 2 }}
                        pathFunc="diagonal"
                        shouldCollapseNeighborNodes={true}
                    />
                ) : (
                    <div style={{ position: 'absolute', top: '10%', left: '10%' }}>
                        {/* <p>Loading...</p> 로딩 중일 때 텍스트 표시 */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LayerContainer;
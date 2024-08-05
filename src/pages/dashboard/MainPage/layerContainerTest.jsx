// LayerContainer.js
import React, { useState, useEffect } from 'react';
import CircularStatic from "components/CircularStatic";
import Tree from 'react-d3-tree';
import { setOnMessageCallback } from 'src/api/webSocket.js'; 
import Latency from 'pages/dashboard/Analytics/Latency';
import Throughput from 'pages/dashboard/Analytics/Throughput';
import NodeMeasurement from './NodeMeasure/nodeMeasurement';
import testData from './testData'; // import 하드코딩된 데이터
import * as d3 from 'd3';

// Wi-Fi 아이콘 이미지 URL
const wifiIconUrl = 'https://img.icons8.com/?size=100&id=ep0XhqxA19fz&format=png&color=000000';

const LayerContainerTest = () => {
    const [treeData, setTreeData] = useState(null);
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        // 데이터 처리 함수 호출하여 데이터 전달
        const transformedData = transformDataForD3(testData);
        setTreeData(transformedData);
        setNodes(testData);
    }, []); // 빈 배열을 넣어 한 번만 실행되도록 설정

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

    // D3 라이브러리 확장 함수 정의
    useEffect(() => {
        // D3 라이브러리의 선택자 프로토타입을 확장하여 기본 텍스트 스타일을 설정하는 함수 추가
        d3.selection.prototype.applyDefaultTextStyle = function() {
            return this.selectAll("text")
                       .style("font-weight", "lighter");
        };
    }, []); // 빈 배열을 넣어 한 번만 실행되도록 설정

    // 커스텀 노드 엘리먼트 렌더링 함수
    const renderCustomNodeElement = ({ nodeDatum }) => {
        // 'Router'라는 이름을 가진 노드에만 Wi-Fi 아이콘을 사용
        if (nodeDatum.name === 'Router') {
            return (
                <g>
                    <image
                        x="-25"
                        y="-25"
                        width="50"
                        height="50"
                        xlinkHref={wifiIconUrl}
                    />
                    <text x="20" y="10">{nodeDatum.name}</text>
                </g>
            );
        }

        // 기본적으로는 D3 라이브러리의 기본 노드 디자인 사용
        return (
            <g>
                <circle r={15} fill="#fff" stroke="#000" strokeWidth={1} />
                <text x="20" y="5" fontWeight="lighter">{nodeDatum.name}</text> {/* 기본 글자 굵기 */}
                <text x="20" y="25" fontWeight="lighter">{`Seq: ${nodeDatum.attributes.seq}`}</text> {/* Seq 정보 표시 */}
                <text x="20" y="45" fontWeight="lighter">{`Layer: ${nodeDatum.attributes.layer}`}</text> {/* Layer 정보 표시 */}
                <text x="20" y="65" fontWeight="lighter">{`Parent Mac: ${nodeDatum.attributes.parentMac}`}</text> {/* Parent Mac 정보 표시 */}
                <text x="20" y="85" fontWeight="lighter">{`My Mac: ${nodeDatum.attributes.myMac}`}</text> {/* My Mac 정보 표시 */}
            </g>
        );
    };

    return (
        <div style={{ height: '100vh' }}>
            <h1>Tree Topology</h1>
            <div id="tree-container" style={{ width: '100%', height: '100%' }}>
                {treeData ? (
                    <Tree
                        data={treeData}
                        orientation="vertical"
                        translate={{ x: 100, y: 100 }}
                        nodeSize={{ x: 200, y: 200 }}
                        separation={{ siblings: 1, nonSiblings: 2 }}
                        pathFunc="diagonal"
                        shouldCollapseNeighborNodes={true}
                        nodeSvgShape={(nodeDatum) => ({
                            shape: 'circle',
                            shapeProps: {
                                r: 15,
                                fill: nodeDatum.seq === 1 ? 'green' : 'blue', // seq가 1이면 녹색, 아니면 파란색
                                stroke: '#000',
                                strokeWidth: 1
                            }
                        })}
                        onMount={() => {
                            // D3 확장 함수를 호출하여 기본 텍스트 스타일 적용
                            d3.select("#tree-container").applyDefaultTextStyle();
                        }}
                        //renderCustomNodeElement={renderCustomNodeElement}
                    />
                ) : (
                    <CircularStatic /> 
                )}
            </div>
            <div style={{ display: 'none' }}>
                <Latency nodes={nodes} /> {/* Latency 컴포넌트에 노드 데이터를 전달 */}
                <Throughput nodes={nodes} /> {/* Throughput 컴포넌트에 노드 데이터를 전달 */}
                <NodeMeasurement nodes={nodes} /> {/* nodeMeasurement 컴포넌트에 노드 데이터를 전달 */}
            </div>
        </div>
    );
};

export default LayerContainerTest;
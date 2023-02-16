// @ts-nocheck
import React, { useCallback, useState, useEffect } from 'react';
import { useGraphInstance } from './lib/Graph';

// 以 Behavior的模式组织代码逻辑
// 当前这个behavior加载数据初始化节点和边，这个组件卸载的时候清空画布
const GraphBehavior = () => {
  const graph = useGraphInstance();

  useEffect(() => {
    if (graph) {
      const data = {
        // 节点
        nodes: [
          {
            id: 'node1', // String，可选，节点的唯一标识
            x: 40,       // Number，必选，节点位置的 x 值
            y: 40,       // Number，必选，节点位置的 y 值
            width: 80,   // Number，可选，节点大小的 width 值
            height: 40,  // Number，可选，节点大小的 height 值
            label: 'hello', // String，节点标签
          },
          {
            id: 'node2', // String，节点的唯一标识
            x: 160,      // Number，必选，节点位置的 x 值
            y: 180,      // Number，必选，节点位置的 y 值
            width: 80,   // Number，可选，节点大小的 width 值
            height: 40,  // Number，可选，节点大小的 height 值
            label: 'world', // String，节点标签
          },
        ],
        // 边
        edges: [
          {
            source: 'node1', // String，必须，起始节点 id
            target: 'node2', // String，必须，目标节点 id
          },
        ],
      };

      // 使用Promise模拟异步获取数据
      Promise.resolve(data).then((data) => {
        graph.fromJSON(data);
      });
      return () => graph && graph.clearCells();
    }
    console.log('graph instance', graph);
  }, [graph]);

  return null;
};

export default GraphBehavior;


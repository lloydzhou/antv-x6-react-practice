import React, { useEffect, useCallback, useState, useRef } from 'react'
import { Button } from 'antd'
import './App.css';
import 'antd/dist/antd.css';
// import { Graph, useGraphInstance } from 'react-x6-graph'
import { Graph, useGraphInstance } from './Graph'

// 以 Behavior的模式组织代码逻辑
// 当前这个behavior加载数据初始化节点和边，这个组件卸载的时候清空画布
const GraphBehavior = () => {
  const graph = useGraphInstance()

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
      Promise.resolve(data).then(data => {
        graph.fromJSON(data)
      })
      return () => graph && graph.clearCells()
    }
    console.log('graph instance', graph)
  }, [graph])

  return null
}

// 这个behavior添加一个按钮，点击的时候添加节点并计数
const GraphAddButton = () => {
  const graph = useGraphInstance()
  const [count, setCount] = useState(0)
  const addNode = useCallback(() => {
    console.log('addNode', graph)
    if (graph) {
      console.log('addNode', count)
      setCount(count + 1)
      graph.addNode({
        width: 80,
        height: 40,
        x: 100,
        y: 100,
        label: `label ${count + 1}`
      })
    }
  }, [count, graph])

  return <Button type="primary" onClick={addNode}>添加节点: {count}</Button>
}

function App() {
  const gRef = useRef()
  useEffect(() => {
    console.log('ref', gRef)
  }, [gRef.current])
  return (
    <div className="App">
      <Graph grid resizing snapline keyboard clipboard width={800} height={600}>
        <GraphBehavior />
        <GraphAddButton />
      </Graph>
      <Graph grid width={800} height={600} ref={gRef}>
        <GraphAddButton />
      </Graph>
    </div>
  );
}

export default App;

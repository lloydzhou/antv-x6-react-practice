import React, { useEffect, useCallback, useState, useRef } from 'react'
import { Button, Menu } from 'antd'
import './App.css';
import 'antd/dist/antd.css';
import { Graph, useGraphInstance, useGraphState } from './lib/index'
import AddNodeBehavior from "./AddNodeBehavior";
import ContextMenu, { useContextMenuContext } from "./ContextMenu";
import FromJSONBehavior from "./FromJSONBehavior";
import EventBehavior from "./EventBehavior";


function App() {
  const mRef = useRef()
  const mRef1 = useRef()
  const { nodes, setNodes, edges, setEdges, graph: gRef } = useGraphState()
  useEffect(() => {
    setNodes([
      {
        id: 'node1', // String，可选，节点的唯一标识
        x: 40,       // Number，必选，节点位置的 x 值
        y: 40,       // Number，必选，节点位置的 y 值
        width: 80,   // Number，可选，节点大小的 width 值
        height: 40,  // Number，可选，节点大小的 height 值
        label: 'hello', // String，节点标签
        ports: [{ id: "port1" }],
      },
      {
        id: 'node2', // String，节点的唯一标识
        x: 160,      // Number，必选，节点位置的 x 值
        y: 180,      // Number，必选，节点位置的 y 值
        width: 80,   // Number，可选，节点大小的 width 值
        height: 40,  // Number，可选，节点大小的 height 值
        label: 'world', // String，节点标签
        ports: [{ id: "port1" }],
      },
    ])
    setEdges([
      {
        source: 'node1', // String，必须，起始节点 id
        target: 'node2', // String，必须，目标节点 id
      },
    ])
  }, [])
  return (
    <div className="App">
      <Graph grid resizing snapline keyboard clipboard width={800} height={600}>
        <FromJSONBehavior />
        <AddNodeBehavior />
      </Graph>
      <Graph grid width={800} height={600} ref={gRef}>
        <AddNodeBehavior />
        <ContextMenu ref={mRef1} bindType="edge">
          <Menu style={{ background: "#fff" }} onClick={e => {
            if (e.key == 1 && gRef.current && mRef1.current) {
              const { item } = mRef1.current.context
              if (item) {
                console.log('add label', item)
                const index = edges.findIndex(i => i.id == item.id)
                if (index > -1) {
                  const labels = edges[index]['labels']
                  const length = labels.length + 1
                  edges[index]['labels'] = Array(length).fill(0).map((_, i) => ({
                    attrs: { label: { text: `edge label ${i}` } },
                    position: { distance: i/length + 0.1 },
                  }))
                  setEdges(edges)
                }
              }
            }
            if (e.key == 2 && gRef.current && mRef1.current) {
              const { item } = mRef1.current.context
              if (item) {
                console.log('remove label', item)
                const index = edges.findIndex(i => i.id == item.id)
                if (index > -1) {
                  const labels = edges[index]['labels']
                  const length = labels.length - 1 > -1 ? labels.length - 1 : 0
                  edges[index]['labels'] = Array(length).fill(0).map((_, i) => ({
                    attrs: { label: { text: `edge label ${i}` } },
                    position: { distance: i/length + 0.1 },
                  }))
                  setEdges(edges)
                }
              }
            }
          }} items={[{ key: 1, label: 'add label' }, { key: 2, label: 'remove label' }]} />
        </ContextMenu>
        <ContextMenu ref={mRef1} bindType="node">
          <Menu style={{ background: "#fff" }} onClick={e => {
            if (e.key == 1 && gRef.current && mRef1.current) {
              const { item } = mRef1.current.context
              if (item) {
                console.log('remove item', item)
                gRef.current.removeCell(item)
              }
            }
            if (e.key == 3 && gRef.current && mRef1.current) {
              const { item } = mRef1.current.context
              if (item) {
                console.log('remove item', item)
                setNodes(nodes.filter(i => i.id !== item.id))
              }
            }
            if (e.key == 4 && gRef.current && mRef1.current) {
              const { item } = mRef1.current.context
              if (item) {
                console.log('add port', item)
                const index = nodes.findIndex(i => i.id == item.id)
                if (index > -1) {
                  const ports = nodes[index]['ports']
                  nodes[index]['ports'] = [...ports, {id: `port${ports.length + 1}`}]
                  setNodes(nodes)
                }
              }
            }
            if (e.key == 5 && gRef.current && mRef1.current) {
              const { item } = mRef1.current.context
              if (item) {
                console.log('remove port', item)
                const index = nodes.findIndex(i => i.id == item.id)
                if (index > -1) {
                  const ports = nodes[index]['ports']
                  nodes[index]['ports'] = [...ports.slice(0, ports.length - 1)]
                  console.log('remove port', nodes[index].ports)
                  setNodes(nodes)
                }
              }
            }
          }} items={[{ key: 1, label: '移除' }, { key: 3, label: 'setNodes 移除' }, { key: 4, label: '增加port' }, { key: 5, label: '移除port' }, {key: 2, label: '菜单2'}]} />
        </ContextMenu>
        <ContextMenu bindType="blank" ref={mRef}>
          <Menu style={{ background: "#fff" }} onClick={e => {
            console.log('e', e, mRef.current.context, nodes, edges)
            if (e.key == 1 && gRef.current && mRef.current) {
              const { x, y } = mRef.current.context
              gRef.current.addNode({
                x: x - 40,
                y: y - 20,
                width: 80,
                height: 40,
                label: 'label'
              })
            }
            if (e.key == 3 && gRef.current && mRef.current) {
              const { x, y } = mRef.current.context
              setNodes([...nodes, {
                x: x - 40,
                y: y - 20,
                width: 80,
                height: 40,
                label: 'label'
              }])
            }
            mRef.current.onClose()
          }} items={[{ key: 1, label: '添加节点' }, {key: 3, label: '使用setNodes添加'}, {key: 2, label: '菜单2'}]} />
        </ContextMenu>
        <EventBehavior />
      </Graph>
    </div>
  );
}

export default App;

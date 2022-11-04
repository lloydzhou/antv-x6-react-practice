import React, { useEffect, useCallback, useState, useRef } from 'react'
import { Button, Menu } from 'antd'
import './App.css';
import 'antd/dist/antd.css';
import { Graph, useGraphInstance } from './Graph'
import AddNodeBehavior from "./AddNodeBehavior";
import ContextMenu, { useContextMenuContext } from "./ContextMenu";
import FromJSONBehavior from "./FromJSONBehavior";


function App() {
  const gRef = useRef()
  const mRef = useRef()
  useEffect(() => {
    console.log('ref', gRef)
  }, [gRef.current])
  return (
    <div className="App">
      <Graph grid resizing snapline keyboard clipboard width={800} height={600}>
        <FromJSONBehavior />
        <AddNodeBehavior />
      </Graph>
      <Graph grid width={800} height={600} ref={gRef}>
        <AddNodeBehavior />
        <ContextMenu bindType="blank" ref={mRef}>
          <Menu style={{ background: "#fff" }} onClick={e => {
            console.log('e', e, mRef.current.context)
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
            mRef.current.onClose()
          }} items={[{ key: 1, label: '添加节点' }, {key: 2, label: '菜单2'}]} />
        </ContextMenu>
      </Graph>
    </div>
  );
}

export default App;

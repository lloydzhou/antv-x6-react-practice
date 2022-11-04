import React, { useEffect, useCallback, useState, useRef } from 'react'
import { Button, Menu } from 'antd'
import './App.css';
import 'antd/dist/antd.css';
import { Graph, useGraphInstance } from './Graph'
import AddNodeBehavior from "./AddNodeBehavior";
import ContextMenu from "./ContextMenu";
import FromJSONBehavior from "./FromJSONBehavior";

function App() {
  const gRef = useRef()
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
        <ContextMenu bindType="blank">
          <Menu style={{ background: "#fff" }}>
            <Menu.Item key="1">菜单1</Menu.Item>
            <Menu.Item key="2">菜单2</Menu.Item>
            <Menu.Item key="3">菜单3</Menu.Item>
          </Menu>
        </ContextMenu>
      </Graph>
    </div>
  );
}

export default App;

import React, { useCallback, useState } from "react";
import { Button } from "antd";
import { useGraphInstance } from './lib/Graph'

export const AddNodeBehavior = () => {
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
};
export default AddNodeBehavior;


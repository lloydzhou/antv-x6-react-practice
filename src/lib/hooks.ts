import { Graph, Node, Edge } from '@antv/x6';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { diffCells, patch, checkId } from './utils'

type GraphState = {nodes?: Node.Metadata[], edges?: Edge.Metadata[], graph?: Graph}
export const useGraphState = (initState: GraphState = {}) => {
  const { nodes: n = [], edges: e = [], graph: g = null } = initState;
  const [nodes, _setNodes] = useState<Node.Metadata[]>(n);
  const [edges, _setEdges] = useState<Edge.Metadata[]>(e);
  const graph = useRef<Graph | null>(g);
  const diffNodes = useMemo(() => diffCells(graph.current, nodes, 'node'), [nodes]);
  // 节点变化可能引起边的变化
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const diffEdges = useMemo(() => diffCells(graph.current, edges, 'edge'), [nodes, edges]);

  const setGraph = useCallback((_g: Graph) => { if (_g) { graph.current = _g; } }, []);

  const eventName = 'update:state'
  // 注册一个自定义事件，patch完成后触发
  const returnPromise = (execute: () => void) => {
    return new Promise((resolve) => {
      if (graph.current) {
        graph.current.once(eventName, resolve)
      }
      execute()
    })
  }
  // 更新state数据之前先检查id是否存在，自动创建id，确保diffCells的时候能使用id进行判断
  const setNodes = (_nodes: Node.Metadata[]) => returnPromise(() => _setNodes(_nodes.map(checkId)));
  const setEdges = (_edges: Edge.Metadata[]) => returnPromise(() => _setEdges(_edges.map(checkId)));

  const triggerEvent = () => graph.current && graph.current.trigger(eventName)
  // 使用patch函数更新数据到x6画布
  useEffect(() => {
    patch(graph.current, diffNodes)
    triggerEvent()
  }, [diffNodes]);
  useEffect(() => {
    patch(graph.current, diffEdges)
    triggerEvent()
  }, [diffEdges]);

  return {
    nodes, edges, graph, setNodes, setEdges, setGraph,
  };
};

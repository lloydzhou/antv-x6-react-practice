import { Node, Edge, StringExt } from '@antv/x6';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
const diffCells = (graph, cells = [], type = 'node') => {
  const create = [];
  const update = [];
  const remove = [];
  const Ctor = 'node' === type ? Node.create : Edge.create;
  cells.forEach(c => {
    const cell = graph.getCellById(c.id);
    if (cell) {
      // 这里尝试重新调用一下create，然后通过setProp，直接将新创建的放进去
      const t = Ctor(c);
      update.push([cell, t.getProp()]);
      t.dispose();
    } else {
      create.push(type === 'node' ? Node.create(c) : Edge.create(c));
    }
  });
  if (graph) {
    const cellIds = new Set(cells.map(c => c.id));
    const items = type === 'node' ? graph.getNodes() : graph.getEdges();
    items.forEach(cell => {
      if (!cellIds.has(cell.id)) {
        remove.push(cell.id);
      }
    });
  }
  return {
    create,
    update,
    remove
  };
};
const patch = (graph, data) => {
  const {
    create = [],
    update = [],
    remove = []
  } = data;
  // console.log('patch', create, update, remove)
  if (graph) {
    graph.startBatch("patch", data);
    graph.addCell(create);
    update.forEach(([cell, prop]) => cell.setProp(prop));
    remove.forEach(item => graph.removeCell(item));
    graph.stopBatch("patch", data);
  }
};
const checkId = metadata => {
  // 如果没有id就添加一个
  metadata.id = metadata.id || StringExt.uuid();
  return metadata;
};
export const useGraphState = (initState = {}) => {
  const {
    nodes: n,
    edges: e
  } = initState;
  const [nodes, _setNodes] = useState(n);
  const [edges, _setEdges] = useState(e);
  const graph = useRef();
  const diffNodes = useMemo(() => diffCells(graph.current, nodes, 'node'), [nodes]);
  // 节点变化可能引起边的变化
  const diffEdges = useMemo(() => diffCells(graph.current, edges, 'edge'), [nodes, edges]);
  const setGraph = useCallback(g => g && (graph.current = g), []);
  // 设置节点之前先调用create，默认会创建id，然后后面进行判断的时候可以使用id判断是否在画布中
  const setNodes = n => _setNodes(n.map(checkId));
  const setEdges = e => _setEdges(e.map(checkId));
  useEffect(() => setGraph(initState.g), [initState.g, setGraph]);
  useEffect(() => graph.current && patch(graph.current, diffNodes), [diffNodes]);
  useEffect(() => graph.current && patch(graph.current, diffEdges), [diffEdges]);
  return {
    nodes,
    edges,
    graph,
    setNodes,
    setEdges,
    setGraph
  };
};
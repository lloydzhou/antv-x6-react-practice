import { Node, Edge } from '@antv/x6';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
const diffCells = (graph, cells = [], type = 'node') => {
  const create = [];
  const update = [];
  const remove = [];
  cells.forEach(c => {
    const cell = graph.getCellById(c.id);
    if (cell) {
      // 这里尝试重新调用一下create，然后通过setProp，直接将新创建的放进去
      // 这里直接存的是create之后的引用。所以这里的数据应该直接就是新的，所以不用手动update?
      update.push([cell, c.getProp()]);
    } else {
      create.push(c);
    }
  });
  if (graph) {
    const cellIds = new Set(cells.map(c => c.id));
    (type == 'node' ? graph.getNodes() : graph.getEdges()).forEach(cell => {
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
const patch = (graph, {
  create = [],
  update = [],
  remove = []
}, type = 'node') => {
  // console.log('patch', create, update, remove)
  if (graph) {
    graph.startBatch("patch", {
      type
    });
    graph.addCell(create);
    update.forEach(([cell, prop]) => cell.setProp(prop));
    remove.forEach(item => graph.removeCell(item));
    graph.stopBatch("patch", {
      type
    });
  }
};
const prepareCell = (type, metadata) => {
  if (type === 'node') {
    return Node.isNode(metadata) ? metadata : Node.create(metadata);
  }
  return Edge.isEdge(metadata) ? metadata : Edge.create(metadata);
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
  const diffEdges = useMemo(() => diffCells(graph.current, edges, 'edge'), [edges]);
  const setGraph = useCallback(g => g && (graph.current = g), []);
  // 设置节点之前先调用create，默认会创建id，然后后面进行判断的时候可以使用id判断是否在画布中
  const setNodes = n => _setNodes(n.map(prepareCell.bind(null, 'node')));
  const setEdges = e => _setEdges(e.map(prepareCell.bind(null, 'edge')));
  useEffect(() => setGraph(initState.g), [initState.g, setGraph]);
  useEffect(() => graph.current && patch(graph.current, diffNodes, 'node'), [diffNodes]);
  useEffect(() => graph.current && patch(graph.current, diffEdges, 'edge'), [diffEdges]);
  return {
    nodes,
    edges,
    graph,
    setNodes,
    setEdges,
    setGraph
  };
};
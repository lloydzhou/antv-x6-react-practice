import { Graph, Node, Edge, ObjectExt, StringExt } from '@antv/x6';
import {
  useRef, useEffect, useState, useCallback, useMemo,
} from 'react';

type Metadata = Node.Metadata | Edge.Metadata
type C = Node | Edge
type T = C | {[key: string]: any}
type U = T[]


const diffCells = (graph: Graph | null, cells: Metadata[] = [], type: string = 'node') => {
  const create: C[]  = [];
  const update: U[] = [];
  const remove: string[] = [];
  if (graph) {
    const Ctor = type === 'node' ? Node.create : Edge.create;
    cells.forEach((c) => {
      const cell = graph.getCellById(c.id);
      if (cell) {
        // 这里尝试重新调用一下create，然后通过setProp，直接将新创建的放进去
        const t = Ctor(c);
        const prop = t.getProp();
        t.dispose();
        if (!ObjectExt.isEqual(cell.getProp(), prop)) {
          update.push([cell, prop]);
        }
      } else {
        create.push(Ctor(c));
      }
    });
    const cellIds = new Set(cells.map((c) => c.id));
    const items = type === 'node' ? graph.getNodes() : graph.getEdges();
    items.forEach((cell) => {
      if (!cellIds.has(cell.id)) {
        remove.push(cell.id);
      }
    });
  }
  return { create, update, remove };
};

const patch = (graph: Graph | null, data: ReturnType<typeof diffCells>) => {
  const { create = [], update = [], remove = [] } = data;
  // console.log('patch', create, update, remove)
  if (graph) {
    graph.batchUpdate('update', () => {
      graph.addCell(create);
      update.forEach(([cell, prop]) => {
        // 直接一次性更新全部的prop可能导致部分属性更新不成功 cell.setProp(prop)
        // @ts-ignore
        Object.keys(prop).forEach((key:string) => cell.setProp(key, prop[key]));
      });
      remove.forEach((item) => graph.removeCell(item));
    }, data);
  }
};

// 如果没有id就添加一个
const checkId = (metadata: Metadata) => ({ ...metadata, id: metadata.id || StringExt.uuid() });

type GraphState = {nodes?: Node.Metadata[], edges?: Edge.Metadata[], g?: Graph}
export const useGraphState = (initState: GraphState = {}) => {
  const { nodes: n = [], edges: e = [], g } = initState;
  const [nodes, _setNodes] = useState<Node.Metadata[]>(n);
  const [edges, _setEdges] = useState<Edge.Metadata[]>(e);
  const graph = useRef<Graph | null>(g || null);
  const diffNodes = useMemo(() => diffCells(graph.current, nodes, 'node'), [nodes]);
  // 节点变化可能引起边的变化
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const diffEdges = useMemo(() => diffCells(graph.current, edges, 'edge'), [nodes, edges]);

  const setGraph = useCallback((_g: Graph) => { if (_g) { graph.current = _g; } }, []);
  // 更新state数据之前先检查id是否存在，自动创建id，确保diffCells的时候能使用id进行判断
  const setNodes = (_nodes: Node.Metadata[]) => _setNodes(_nodes.map(checkId));
  const setEdges = (_edges: Edge.Metadata[]) => _setEdges(_edges.map(checkId));

  // 使用patch函数更新数据到x6画布
  useEffect(() => patch(graph.current, diffNodes), [diffNodes]);
  useEffect(() => patch(graph.current, diffEdges), [diffEdges]);

  return {
    nodes, edges, graph, setNodes, setEdges, setGraph,
  };
};
export default useGraphState;

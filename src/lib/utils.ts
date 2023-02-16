import { Graph, Node, Edge, ObjectExt, StringExt } from '@antv/x6';

type Metadata = Node.Metadata | Edge.Metadata
type C = Node | Edge
type T = C | {[key: string]: any}
type U = T[]


export const diffCells = (graph: Graph | null, cells: Metadata[] = [], type: string = 'node') => {
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

export const patch = (graph: Graph | null, data: ReturnType<typeof diffCells>) => {
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
export const checkId = (metadata: Metadata) => ({ ...metadata, id: metadata.id || StringExt.uuid() });


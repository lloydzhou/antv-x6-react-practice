import { Edge } from '@antv/x6'
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

const diffCells = (graph, cells=[], type='node') => {
  const create = []
  const update = []
  const remove = []
  cells.forEach(c => {
    const cell = graph.getCellById(c.id)
    if (cell) {
      update.push(c)
    } else {
      create.push(c)
    }
  })
  if (type === 'node' && graph) {
    const nodes = graph.getNodes()
    const cellIds = new Set(cells.map(c => c.id))
    nodes.forEach(node => {
      if (!cellIds.has(node.id)) {
        remove.push(node.id)
      }
    })
  }
  if (type === 'edge' && graph) {
    const edges = graph.getEdges()
    edges.forEach(edge => {
      const cellIds = new Set(cells.map(c => c.id))
      if (!cellIds.has(edge.id) && cells.filter(c => Edge.equalTerminals(edge.source, c.source) && Edge.equalTerminals(edge.target, c.target)).length === 0) {
        remove.push(edge.id)
      }
    })
  }
  return { create, update, remove }
}

const patch = (graph, {create=[], update=[], remove=[]}, type='node') => {
  // console.log('patch', create, update, remove)
  if (graph) {
    if (type === 'node') {
      graph.addNodes(create)
    } else {
      graph.addEdges(create)
    }
    
    if (update.length) {
      // TODO updateCell???
      graph.resetCells(update)
    }
    remove.forEach(item => graph.removeCell(item))
  }
}

export const useGraphState = (initState={}) => {
  const {nodes: n, edges: e} = initState
  const [nodes, setNodes] = useState(n)
  const [edges, setEdges] = useState(e)
  const graph = useRef()
  const diffNodes = useMemo(() => diffCells(graph.current, nodes, 'node'), [nodes])
  const diffEdges = useMemo(() => diffCells(graph.current, edges, 'edge'), [edges])

  const setGraph = useCallback((g) => g && (graph.current = g), [])

  useEffect(() => setGraph(initState.g), [initState.g, setGraph])

  useEffect(() => graph.current && patch(graph.current, diffNodes, 'node'), [diffNodes])
  useEffect(() => graph.current && patch(graph.current, diffEdges, 'edge'), [diffEdges])

  return { nodes, edges, graph, setNodes, setEdges, setGraph }
}


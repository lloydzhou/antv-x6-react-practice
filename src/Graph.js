import * as X6 from '@antv/x6';
import React, { createRef, createContext, useContext, forwardRef, useEffect, useState } from 'react';

const GraphContext = createContext()

export const Graph = forwardRef((props, ref) => {
  const [graph, setGraph] = useState(null)
  const realRef = ref || createRef()
  const { container, children, ...other } = props
  const containerRef = createRef(container)

  useEffect(() => {
    if (containerRef.current && !realRef.current) {
      const graph = new X6.Graph({
        container: containerRef.current,
        ...other,
      })
      setGraph(realRef.current = graph)
    }
  }, [containerRef.current])

  return (
    <>
      {containerRef.current ? null : <div ref={containerRef} />}
      <GraphContext.Provider value={graph}>
        {!!graph && children}
      </GraphContext.Provider>
    </>
  )
})

export const useGraphInstance = () => useContext(GraphContext)

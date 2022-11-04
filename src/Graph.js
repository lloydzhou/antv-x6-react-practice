import * as X6 from '@antv/x6';
import React, { createRef, createContext, useContext, forwardRef, useEffect } from 'react';

const GraphContext = createContext()

export const Graph = forwardRef((props, ref) => {
  const realRef = ref || createRef()
  const { container, children, ...other } = props
  const containerRef = createRef(container)

  useEffect(() => {
    if (!realRef.current) {
      const graph = new X6.Graph({
        container: containerRef.current,
        ...other,
      })
      realRef.current = graph
    }
  })

  return (
    <GraphContext.Provider value={realRef}>
      {containerRef.current ? null : <div ref={containerRef} />}
      {children}
    </GraphContext.Provider>
  )
})

export const useGraphInstance = () => useContext(GraphContext)

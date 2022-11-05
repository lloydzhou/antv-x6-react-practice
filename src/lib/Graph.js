import * as X6 from '@antv/x6';
import React, { createRef, createContext, useContext, forwardRef, useEffect, useState } from 'react';

const GraphContext = createContext()

export const Graph = forwardRef((props, ref) => {
  const [graph, setGraph] = useState(null)
  const realRef = ref || createRef()
  const { container, children, className='react-x6-graph', ...other } = props
  const containerRef = createRef(container)

  useEffect(() => {
    if (containerRef.current && !realRef.current) {
      const graph = new X6.Graph({
        container: containerRef.current,
        ...other,
      })
      setGraph(realRef.current = graph)
    }
  }, [])

  return (
    <div className={className} style={{
      width: '100%',
      height: '100%',
      position: 'relative',
    }}>
      <GraphContext.Provider value={graph}>
        {!container && <div ref={containerRef} />}
        {!!graph && children}
      </GraphContext.Provider>
    </div>
  )
})

export const useGraphInstance = () => useContext(GraphContext)

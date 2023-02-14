import {Graph as X6Graph} from '@antv/x6';
import React, { useRef, createContext, useContext, forwardRef, useEffect, useState } from 'react';

const GraphContext = createContext()

export const Graph = forwardRef((props, ref) => {
  const [graph, setGraph] = useState(null)
  const { container, children, className='react-x6-graph', ...other } = props
  const containerRef = useRef(container)

  useEffect(() => {
    if (containerRef.current && !graph) {
      const graph = new X6Graph({
        container: containerRef.current,
        ...other,
      })
      setGraph(graph)
      if (typeof ref === "function") {
        ref(graph)
      } else if (ref) {
        ref.current = graph
      }
    }
  }, [graph, other, ref])

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

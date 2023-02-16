import * as X6 from '@antv/x6';
import React, { useRef, createContext, useContext, forwardRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react'

const GraphContext = createContext<X6.Graph | null>(null);

interface Props {
  className?: string;
  container?: HTMLDivElement;
  children?: ReactNode;
};

export const Graph = forwardRef<X6.Graph, X6.Graph.Options & Props>((props, ref) => {
  const [graph, setGraph] = useState<X6.Graph | null>(null);
  const { container, children, className = 'react-x6-graph', ...other } = props;
  const containerRef = useRef<HTMLDivElement>(container || null);

  useEffect(() => {
    if (containerRef.current && !graph) {
      const graph = new X6.Graph({
        container: containerRef.current,
        ...other,
      });
      setGraph(graph);
      if (typeof ref === 'function') {
        ref(graph);
      } else if (ref) {
        ref.current = graph;
      }
    }
  }, [graph, other, ref]);

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <GraphContext.Provider value={graph}>
        {!container && <div ref={containerRef} />}
        {!!graph && children}
      </GraphContext.Provider>
    </div>
  );
});

export const useGraphInstance = () => useContext(GraphContext);

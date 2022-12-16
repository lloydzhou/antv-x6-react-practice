import * as X6 from '@antv/x6';
import React, { useRef, createContext, useContext, forwardRef, useEffect, useState } from 'react';
const GraphContext = /*#__PURE__*/createContext();
export const Graph = /*#__PURE__*/forwardRef((props, ref) => {
  const [graph, setGraph] = useState(null);
  const {
    container,
    children,
    className = 'react-x6-graph',
    ...other
  } = props;
  const containerRef = useRef(container);
  useEffect(() => {
    if (containerRef.current && !graph) {
      const graph = new X6.Graph({
        container: containerRef.current,
        ...other
      });
      setGraph(graph);
      if (typeof ref === "function") {
        ref(graph);
      } else if (ref) {
        ref.current = graph;
      }
    }
  }, [graph, other, ref]);
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      width: '100%',
      height: '100%',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(GraphContext.Provider, {
    value: graph
  }, !container && /*#__PURE__*/React.createElement("div", {
    ref: containerRef
  }), !!graph && children));
});
export const useGraphInstance = () => useContext(GraphContext);
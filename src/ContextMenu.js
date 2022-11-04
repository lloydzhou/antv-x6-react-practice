import React, { useEffect, useState, useRef } from "react";
import { useGraphInstance } from './Graph'

export const useContextMenu = (props) => {
  const { bindType = "node", bindEvent = "contextmenu", container } = props;
  const graph = useGraphInstance();
  /** createContext内的数据 */
  const [context, setContext] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
    view: null,
    onClose: () => {},
    onShow: null
  });

  const [oldOptions, setOldOptions] = useState({
    preventDefaultContextMenu: true,
    preventDefaultBlankAction: true
  });

  const handleShow = ({ e, x, y }) => {
    e.preventDefault();
    e.stopPropagation();
    if (!container.current) {
      return;
    }
    // 将画布本地坐标转换为画布坐标
    const { x: px, y: py } = graph.localToGraph(x, y);
    let view = null;
    let item = null;
    if (bindType === "node" || bindType === "edge") {
      const views = graph.findViewsFromPoint(x, y).filter((v) => {
        if (bindType === "edge") {
          // @ts-ignore
          return !!v.targetView;
        }
        // @ts-ignore
        return !v.targetView;
      });
      if (views.length) {
        // @ts-ignore
        const v = views
          .sort((a, b) => a.cell.getZIndex() < b.cell.getZIndex())
          .pop();
        view = v;
        item = v?.cell;
      }
    }
    setContext({
      ...context,
      visible: true,
      x: px,
      y: py,
      view,
      item
    });
  };
  const handleClose = () => {
    setContext({
      ...context,
      visible: false,
      x: 0,
      y: 0,
      view: null,
      item: null
    });
  };

  useEffect(() => {
    if (graph) {
    graph.on(`${bindType}:${bindEvent}`, handleShow);
    if (!(bindType === "blank" && bindEvent === "click")) {
      graph.on("blank:click", handleClose);
    }
    graph.on("blank:mousedown", handleClose);
    graph.on("blank:mousewheel", handleClose);
    // if (container.value) {
    //   container.value.addEventListener('click', handleClose, false)
    // }

    // 组件加载的时候保存旧的配置
    const {
      preventDefaultContextMenu = true,
      preventDefaultBlankAction = true
    } = graph.options || {};
    // @ts-ignore
    setOldOptions({ preventDefaultContextMenu, preventDefaultBlankAction });
    setContext({ ...context, onShow: handleShow, onClose: handleClose });
    }

    return () => {
      if (graph) {
      graph.off(`${bindType}:${bindEvent}`, handleShow);
      graph.off("blank:click", handleClose);
      graph.off("blank:mousedown", handleClose);
      graph.off("blank:mousewheel", handleClose);
      // if (container.value) {
      //   container.value.removeEventListener('click', handleClose, false)
      // }

      // 卸载的时候恢复之前的值
      const {
        preventDefaultContextMenu = true,
        preventDefaultBlankAction = true
      } = oldOptions;
      graph.options.preventDefaultContextMenu = preventDefaultContextMenu;
      graph.options.preventDefaultBlankAction = preventDefaultBlankAction;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, bindEvent, bindType]);

  return context;
};

const defaultStyle = {
  width: "120px",
  boxShadow: "0 4px 12px rgb(0 0 0 / 15%)"
};

const ContextMenuContext = React.createContext();

export const ContextMenu = (props) => {
  const { bindType, bindEvent, style = {}, children } = props;
  const container = useRef(null);
  const context = useContextMenu({
    bindType: bindType || "node",
    bindEvent: bindEvent || "contextmenu",
    container
  });

  const { visible, x, y, item, onClose } = context;
  const positionStyle = {
    position: "absolute",
    left: x + "px",
    top: y + "px"
  };
  const id = item ? item.id : "";
  return (
    <ContextMenuContext.Provider value={context}>
      <div
        ref={container}
        className="x6-widget-contextmenu"
        // @ts-ignore
        style={{ ...defaultStyle, ...style, ...positionStyle }}
        key={id}
        onClick={(e) => onClose()}
      >
        {visible && children}
      </div>
    </ContextMenuContext.Provider>
  );
};

export default ContextMenu;


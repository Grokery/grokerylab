
export const d3state = (state = {}, action) => {
    // console.log(action)
    return state
}

// d3state = {
//         width: width,
//         height: height,
//         maxX: -9999,
//         maxY: -9999,
//         minX: 9999,
//         minY: 9999,
//         scale: .5,
//         highlightedMaxX: -9999,
//         highlightedMaxY: -9999,
//         highlightedMinX: 9999,
//         highlightedMinY: 9999,
//         selectedNodes: selectedNodeId ? [nodes[selectedNodeId]] : [],
//         selectedEdge: null,
//         mouseDownNode: null,
//         mouseDownEdge: null,
//         dragging: false,
//         justScaleTransGraph: false,
//         lastKeyDown: -1,
//         drawEdge: false,
//         selectedText: null,
//         dblClickSVGTimeout: false,
//         dblClickNodeTimeout: false,
//         dblClickPathTimeout: false,
//         changedNodes: {},
//         selectedClass: "selected",
//         shapeGClass: "conceptG",
//         shapeWidth: 160,
//         shapeHeight: 120,
//         xgridSize: 10,
//         ygridSize: 10,
//         nodes: [],
//         edges: [],
//         mouseLocation: [0,0],
//         dragNode: null
//     }
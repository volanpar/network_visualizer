import React from 'react';
import { N_CORNER, N_WIDTH, N_WIDTH_FOCUS, CLR_LINK_TEXT, CLR_BACKGROUND, CLR_NODE, CLR_INPUT_NODE } from '../Constants';
import { get_node_color } from '../Color';

const Node = props => {
  const { position, fields, focused, onNodeClicked } = props;
  const { x, y } = position;
  const width = N_WIDTH;
  const height = N_WIDTH;
  const rx = N_CORNER;
  const ry = N_CORNER;

  let stroke_rect = null;
  let rect_x = x - (N_WIDTH / 2), rect_y = y - (N_WIDTH / 2);

  // rect
  let rect = <rect
    key={fields.id + "_rect"}
    x={rect_x} y={rect_y}
    width={width} height={height}
    rx={rx} ry={ry}
    style={{
      fill: get_node_color(fields),
    }}
    onClick={onNodeClicked} />


  // focused? (append stroke)
  if (focused) {
    console.log("..........");
    let gap = N_WIDTH_FOCUS - N_WIDTH;
    let rect_x2 = rect_x - gap / 2;
    let rect_y2 = rect_y - gap / 2;
    stroke_rect = <rect
      key={fields.id + "_stroke"}
      x={rect_x2} y={rect_y2}
      width={N_WIDTH_FOCUS} height={N_WIDTH_FOCUS}
      rx={N_CORNER + 2} ry={N_CORNER + 2}
      style={{
        stroke: get_node_color(fields),
        fillOpacity: 0.0,
        fill: CLR_BACKGROUND
      }}
      onClick={onNodeClicked} />
  }

  // text
  var font_weight = focused ? "bold" : "normal";
  let text_style = {
    fill: CLR_LINK_TEXT,
    fontWeight: font_weight
  };
  let text = <text key={fields.id + "_text"} x={x} y={y} dy={-12} textAnchor={"middle"} style={text_style}>{fields.id}</text>

  return [rect, stroke_rect, text]
}

export default Node;
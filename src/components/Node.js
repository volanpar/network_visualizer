import React from 'react';
import { N_CORNER, N_WIDTH, N_WIDTH_FOCUS, N_FONT_SIZE, CLR_LINK_TEXT  } from '../Constants';

const Node = props => {
  const { id, position, focused, onNodeClicked } = props;
  const { x, y } = position;
  const width = N_WIDTH;
  const height = N_WIDTH;
  const rx = N_CORNER;
  const ry = N_CORNER;
  const style = {

  }
  let rect_x = x - (N_WIDTH / 2), rect_y = y - (N_WIDTH / 2);
  let stroke_rect = null;

  // focused?
  if (focused) {
    let gap = N_WIDTH_FOCUS - N_WIDTH;
    let rect_x2 = rect_x - gap/2;
    let rect_y2 = rect_y - gap/2;
    stroke_rect = <rect key={id + "_stroke"} x={rect_x2} y={rect_y2} width={N_WIDTH_FOCUS} height={N_WIDTH_FOCUS} rx={N_CORNER+2} ry={N_CORNER+2} style={style} onClick={onNodeClicked}/>
  }

  // text
  var font_weight = focused ? "bold" : "normal";
  let text_style = {
    "fill": CLR_LINK_TEXT, 
    "font-weight": font_weight
  };
  let text = <text key={id+"_text"} x={x} y={y} dy={-12} text-anchor={"middle"} style={text_style}>{id}</text> 

  return [<rect key={id} x={rect_x} y={rect_y} width={width} height={height} rx={rx} ry={ry} style={style} onClick={onNodeClicked} />, stroke_rect, text]
}

export default Node;
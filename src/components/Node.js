import React from 'react';
import { N_CORNER, N_WIDTH, N_WIDTH_FOCUS, CLR_LINK_TEXT, CLR_BACKGROUND } from '../Constants';
import { get_node_color } from '../Color';
import { renderHoverView } from './HoverView';

class Node extends React.Component {

  constructor(props) {
    super(props);
    this.onNodeOver = this.onNodeOver.bind(this);
    this.onNodeOut = this.onNodeOut.bind(this);

    this.state = {
      hover: false,
    }
  }

  renderRects() {
    const { position, node, focused } = this.props;
    const { hover } = this.state;
    const { x, y } = position;

    // rect
    let width = hover ? N_WIDTH_FOCUS : N_WIDTH;
    let rounded = hover ? N_CORNER + 2 : N_CORNER;
    let rect_x = x - (width / 2), rect_y = y - (width / 2);
    let rect = <rect
      key={node.id + "_rect"}
      x={rect_x} y={rect_y}
      width={width} height={width}
      rx={rounded} ry={rounded}
      style={{
        fill: get_node_color(node),
      }}
      onClick={this.props.onNodeClicked}
      onMouseOver={_ => this.onNodeOver(node)}
      onMouseOut={_ => this.onNodeOut(node)} />


    // focused? (append stroke)
    let stroke_rect = null;
    if (focused) {
      let gap = N_WIDTH_FOCUS - N_WIDTH;
      let stroke_width = hover ? 0.0 : 1.5;
      let fill_opacity = hover ? 0.0 : 1.0;

      stroke_rect = <rect
        key={node.id + "_stroke"}
        x={rect_x - gap / 2} y={rect_y - gap / 2}
        width={N_WIDTH_FOCUS} height={N_WIDTH_FOCUS}
        rx={N_CORNER + 2} ry={N_CORNER + 2}
        style={{
          stroke: get_node_color(node),
          strokeWidth: stroke_width,
          fillOpacity: fill_opacity,
          fill: CLR_BACKGROUND
        }}
        onClick={this.props.onNodeClicked}
        onMouseOver={_ => this.onNodeOver(node)}
        onMouseOut={_ => this.onNodeOut(node)} />
    }
    return [stroke_rect, rect]
  }

  renderText() {
    const { position, node, focused } = this.props;
    const { x, y } = position;
    // text
    var font_weight = focused ? "bold" : "normal";
    let text_style = {
      fill: CLR_LINK_TEXT,
      fontWeight: font_weight
    };
    let text = <text key={node.id + "_text"} x={x} y={y} dy={-12} textAnchor={"middle"} style={text_style}>{node.id}</text>
    return text;
  }

  renderInfoBox() {
    return null;
  }

  onNodeOver() {
    this.setState(prevState => {
      prevState.hover = true;
      return prevState;
    });
  }

  onNodeOut() {
    this.setState(prevState => {
      prevState.hover = false;
      return prevState;
    });
  }

  render() {
    let { hover } = this.state;
    let hoverView = hover ? renderHoverView(this.props.node, this.props.position, false) : null;
    return [hoverView, this.renderRects(), this.renderText(), this.renderInfoBox()];
  }
}

export default Node;
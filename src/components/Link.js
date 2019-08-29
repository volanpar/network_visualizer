import React from 'react';
import { LINK_FONT_SIZE, LINEWIDTH_FOCUS, LINEWIDTH, CLR_LINK, CLR_LINK_TEXT, CLR_LINK_FOCUS } from '../Constants';
import { renderHoverView } from './HoverView';


class Link extends React.Component {

    constructor(props) {
        super(props);

        this.onLineOver = this.onLineOver.bind(this);
        this.onLineOut = this.onLineOut.bind(this);

        this.state = {
            hover: false,
        }
    }

    onLineOver() {
        this.setState(prevState => {
            prevState.hover = true;
            return prevState;
        })
    }

    onLineOut() {
        this.setState(prevState => {
            prevState.hover = false;
            return prevState;
        })
    }

    renderLine() {
        const { fromPos, toPos, link, focused, n_focused } = this.props;
        const { hover } = this.state;

        // line
        let color = CLR_LINK;
        let linewidth = LINEWIDTH;
        let display_style = 'block'
        if (link.hasOwnProperty("__weight")) {
            linewidth = link.__weight;
        }

        // width > 1.0
        if (linewidth > 1.0) {
            linewidth = 1.0;
        }
        if (focused || hover) {
            linewidth = LINEWIDTH_FOCUS;
            color = CLR_LINK_FOCUS;
        }

        // this is true if any other are focused
        if (n_focused > 0 && !focused) {
            display_style = 'none';
        } 

        // return HTML line
        let line = <line
            key={link.id + "_line"}
            x1={fromPos.x} y1={fromPos.y}
            x2={toPos.x} y2={toPos.y}
            style={{
                stroke: color,
                strokeWidth: linewidth,
                display: display_style,
            }}></line>;
        return line;
    }

    renderText() {
        const { fromPos, toPos, link, focused, n_focused } = this.props;
        const { hover } = this.state;

        // text
        let tx = fromPos.x + ((toPos.x - fromPos.x) / 2), ty = fromPos.y + ((toPos.y - fromPos.y) / 2);
        let deg = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x) * 180 / Math.PI;
        let deg_text = deg, diff_y = -5;
        if (deg > 90 || deg < -90) {
            deg_text += 180;
            diff_y = +10;
        }

        let font_weight = hover ? "bold" : "normal";

        // this is true if any other are focused
        let display_style = (n_focused > 0 && !focused) ? 'none' : 'block';

        let text = <text
            key={link.id + "_text"}
            x={tx} y={ty}
            dy={diff_y}
            textAnchor={"middle"}
            transform={`rotate(${deg_text} ${tx} ${ty})`}
            style={{
                fontSize: LINK_FONT_SIZE,
                fontWeight: font_weight,
                fill: CLR_LINK_TEXT,
                cursor: "pointer",
                display: display_style
            }}
            onMouseOver={_ => this.onLineOver(link)}
            onMouseOut={_ => this.onLineOut(link)}
        >{link.__show}</text>

        // arrow
        let arrow = <text
            key={link.id + "_arrow"}
            x={tx} y={ty}
            dy={3} dx={10}
            transform={`rotate(${deg} ${tx} ${ty})`}
            style={{
                fill: CLR_LINK,
                fontSize: 10,
                cursor: "pointer",
                display: display_style
            }}
            onMouseOver={_ => this.onLineOver(link)}
            onMouseOut={_ => this.onLineOut(link)}
        >></text>

        return [text, arrow];
    }

    render() {
        let hoverView = null;

        // BUG: HOVERVIEW ARE DRAWING NODES "OVER" HOVERVIEW, NOT A BIG DEAL,
        // BUT NEEDS TO BE FIXED.
        // let { hover } = this.state;
        // if (hover) {
        //     let { fromPos, toPos } = this.props;
        //     let position = {
        //         x: fromPos.x + ((toPos.x - fromPos.x) / 2),
        //         y: fromPos.y + ((toPos.y - fromPos.y) / 2),
        //     };
        //     hoverView = renderHoverView(this.props.link, position, true);
        // }

        return [hoverView, this.renderLine(), this.renderText()];
    }


}

export default Link;
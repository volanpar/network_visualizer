import React from 'react';
import { LINK_FONT_SIZE, LINEWIDTH_FOCUS, LINEWIDTH, CLR_LINK, CLR_LINK_TEXT } from '../Constants';
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
        const { fromPos, toPos, link, focused } = this.props;
        const { hover } = this.state;

        // line
        let linewidth = LINEWIDTH;
        if (link.hasOwnProperty("__weight")) {
            linewidth = link.__weight;
        }
        linewidth = focused || hover ? LINEWIDTH_FOCUS : linewidth;
        let line = <line
            key={link.id + "_line"}
            x1={fromPos.x} y1={fromPos.y}
            x2={toPos.x} y2={toPos.y}
            style={{
                stroke: CLR_LINK,
                strokeWidth: linewidth,
            }}></line>;

        return line;
    }

    renderText() {
        const { fromPos, toPos, link, focused } = this.props;
        const { hover } = this.state;

        // text
        let tx = fromPos.x + ((toPos.x - fromPos.x) / 2), ty = fromPos.y + ((toPos.y - fromPos.y) / 2);
        let deg = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x) * 180 / Math.PI;
        let deg_text = deg, diff_y = -5;
        if (deg > 90 || deg < -90) {
            deg_text += 180;
            diff_y = +10;
        }

        var font_weight = hover ? "bold" : "normal";
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
                cursor: "pointer"
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
                cursor: "pointer"
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
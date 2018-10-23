import React from 'react';
import { LINK_FONT_SIZE, CLR_LINK, CLR_LINK_TEXT } from '../Constants';

const Link = props => {
    const { fromPos, toPos, fields, focused } = props;

    // line
    var linewidth = focused ? 0.9 : 0.1;
    let line = <line
        x1={fromPos.x} y1={fromPos.y}
        x2={toPos.x} y2={toPos.y}
        style={{
            stroke: CLR_LINK,
            strokeWidth: linewidth
        }}></line>;

    // text
    let tx = fromPos.x + ((toPos.x - fromPos.x) / 2), ty = fromPos.y + ((toPos.y - fromPos.y) / 2);
    let deg = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x) * 180 / Math.PI;
    let deg_text = deg, diff_y = -5;
    if (deg > 90 || deg < -90) {
        deg_text += 180;
        diff_y = +10;
    }
    let text = <text
        key={fields.id + "_text"}
        x={tx} y={ty}
        dy={diff_y}
        textAnchor={"middle"}
        transform={`rotate(${deg_text} ${tx} ${ty})`}
        style={{
            fontSize: LINK_FONT_SIZE,
            fill: CLR_LINK_TEXT,
            cursor: "pointer"
        }}>{fields.__show}</text>

    // arrow
    let arrow = <text
        key={fields.id + "_arrow"}
        x={tx} y={ty}
        dy={3} dx={10}
        transform={`rotate(${deg} ${tx} ${ty})`}
        style={{
            fill: CLR_LINK,
            fontSize: 10
        }}>></text>

    return [line, text, arrow]
}

export default Link;
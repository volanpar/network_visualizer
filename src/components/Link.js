import React from 'react';
import { LINEWIDTH_OPACITY, LINEWIDTH_OPACITY_FOCUS, LINEWIDTH, CLR_LINK } from '../Constants';

const Link = props => {
    const { fromPos, toPos, fields, focused } = props;

    var linewidth = focused ? 0.9 : 0.1;
    var text = fields.hasOwnProperty("__show") ? fields.__show : "";

    let style = {
        stroke: CLR_LINK,
        strokeWidth: linewidth,
        opacity: 1,
    }
    

    return <line x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y} style={style}></line>
}

export default Link;
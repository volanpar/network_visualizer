import React from 'react';
import { LINEWIDTH_OPACITY, LINEWIDTH_OPACITY_FOCUS, LINEWIDTH, CLR_LINK } from '../Constants';

const Link = props => {
    const { fromPos, toPos, fields, focused } = props;

    var opacity = focused ? LINEWIDTH_OPACITY_FOCUS : LINEWIDTH_OPACITY;
    var text = fields.hasOwnProperty("__show") ? fields.__show : "";

    let style = {
        stroke: CLR_LINK,
        strokeWidth: LINEWIDTH,
        opacity: opacity,
    }
    

    return <line x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y} style={style}></line>
}

export default Link;
import React from 'react';


const Link = props => {
    const { fromPos, toPos, label, focused } = props;


    let style = {
        stroke: "black",
        strokeWidth: 1,
    }

    return <line x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y} style={style} />
}

export default Link;
import React from 'react';

const Node = props => {
  const { id, position } = props;
  const { x, y } = position;
  const width = 14;
  const height = 14;
  const rx = 4;
  const ry = 4;
  const style = {

  }

  return <rect id={id} x={x} y={y} width={width} height={height} rx={rx} ry={ry} style={style}/>;
}

export default Node;
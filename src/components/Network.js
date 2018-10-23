import React from 'react';

const renderNodes = nodes => {
    return;
}

const renderLinks = links => {
    return;
}

const Network = props => {
    return (
      <div>
       {renderLinks(props)}
       {renderNodes(props)}
      </div>
    );
  }

export default Network;
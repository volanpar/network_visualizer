import React from 'react';


function number_of_visible_links(links) {
    return Object.keys(links).filter(link_id => links[link_id].visible).length;
}

function InfoView(props) {
    const { nodes, links, index } = props;
    return (
        <div id="infoView">
            <div>
            Number of links (visible): {Object.keys(links).length} ({number_of_visible_links(links)})
            </div>
            <div>
            Number of nodes: {Object.keys(nodes).length}
            </div>
            <div>
            Sequence position: {index}
            </div>
        </div>
    );
}

export default InfoView;
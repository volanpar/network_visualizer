import React, { Component } from 'react';
import './App.css';
import InfoView from './components/InfoView';
import Node from "./components/Node";
import Link from "./components/Link";
import { WIDTH, HEIGHT } from "./Constants";


class App extends Component {

  constructor() {
    super();

    this.margin = 100;
    this.default_hspace = 150;
    this.default_vspace = 100;
    this.default_n_node_layer = 10;

    this.state = {
      index: 0,
      sequence: [],
      meta: {
        hspace: this.default_hspace,
        vspace: this.default_vspace,
        n_nodes_layer: this.default_n_node_layer
      },
      currentNetwork: null,
      focusedNodes: {}
    }

    this.onFileUpdated = this.onFileUpdated.bind(this);
    this.parseMeta = this.parseMeta.bind(this);
    this.find_layers = this.find_layers.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onNodeClicked = this.onNodeClicked.bind(this);
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyPress);
    // prevent using default arrow navigation in browser window
    window.addEventListener("keydown", function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
    }, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  onFileUpdated(event) {
    // create new file reader
    let reader = new FileReader();

    // define onload
    reader.onload = ev => {
      // make sure file is ready
      if (ev.target.readyState !== 2) {
        return;
      }

      // parse file
      let data = JSON.parse(reader.result);
      let meta = this.parseMeta(data.meta);
      let sequence = data.sequence;
      let currentNetwork = sequence[0];
      let focusedNodes = {};

      // set new state
      this.setState(_ => {
        return { index: 0, sequence, meta, currentNetwork, focusedNodes };
      });
    }

    // start reading first file
    reader.readAsText(event.target.files[0])
  }

  parseMeta(meta) {
    let hspace = this.default_hspace;
    if (meta.properties.hasOwnProperty("column-spacing")) {
      hspace = meta.properties["column-spacing"];
    }

    let vspace = this.default_vspace;
    if (meta.properties.hasOwnProperty("row-spacing")) {
      vspace = meta.properties["row-spacing"];
    }

    let n_nodes_layer = this.default_n_node_layer;
    if (meta.properties.hasOwnProperty("nodes-per-layer")) {
      n_nodes_layer = meta.properties["nodes-per-layer"];
    }

    return { hspace, vspace, n_nodes_layer };
  }

  handleKeyPress(event) {
    if (event.key === "ArrowLeft") {
      this.previous();
    } else if (event.key === "ArrowRight") {
      this.next();
    }
  }

  next() {
    let { index, sequence } = this.state;
    if (index < sequence.length - 1) {
      this.setState(prevState => {
        index += 1;
        let currentNetwork = sequence[index];
        return {
          ...prevState,
          index,
          currentNetwork,
        }
      });
    }
  }

  previous() {
    let { index, sequence } = this.state;
    if (index > 0) {
      this.setState(prevState => {
        index -= 1;
        let currentNetwork = sequence[index];
        return {
          ...prevState,
          index,
          currentNetwork,
        }
      });
    }
  }

  calculate_node_coordinates(nodes) {
    // default dict
    var handler_zero_value = {
      get: function (target, name) {
        return target.hasOwnProperty(name) ? target[name] : 0;
      }
    };
    var layer_positions = new Proxy({}, handler_zero_value)

    var n_externals = 0;
    var positions = {};

    nodes.forEach(node => {
      let x, y;
      // external node?
      if (node.__type === "external") {
        x = this.margin + this.state.meta.hspace / 2 + (n_externals++ * this.state.meta.hspace);
        y = this.margin * 0.5;
      } else {
        x = this.margin + (node.__layer * this.state.meta.hspace);
        y = this.margin + (layer_positions[node.__layer]++ * this.state.meta.vspace);
      }
      positions[node.id] = { x, y };
    })

    return positions;
  }

  onNodeClicked(id) {
    let focused = this.state.focusedNodes[id];
    if (!focused) {
      this.setState(prevState => {
        prevState.focusedNodes[id] = true;
        return prevState
      })
    } else {
      this.setState(prevState => {
        prevState.focusedNodes[id] = false;
        return prevState
      })
    }
  }

  find_layers(nodes) {
    // input and hidden
    var layer_index = 1, n_in_layer = 0;
    for (let [idx, node] of nodes.entries()) {
      // layer allready specified?
      if (node.hasOwnProperty("__layer")) {
        continue;
      }

      // input?
      if (node.__type === "input") {
        nodes[idx].__layer = 0;
      }
      // hidden?
      if (node.__type === "hidden") {
        nodes[idx].__layer = layer_index;

        // hidden layer full?
        if (++n_in_layer >= this.state.meta.n_nodes_layer) {
          layer_index++;
          n_in_layer = 0;
        }
      }
    }

    // output
    var inc = n_in_layer ? 1 : 0;
    for (let [idx, node] of nodes.entries()) {
      // layer allready specified?
      if (node.hasOwnProperty("__layer")) {
        continue;
      }

      if (node.__type === "output") {
        nodes[idx].__layer = layer_index + inc;
      }
    }
  }


  // RENDERING
  renderNetwork() {
    if (!this.state.currentNetwork) {
      return;
    }

    // extract nodes and links from network
    let nodes = this.state.currentNetwork.nodes;
    let links = this.state.currentNetwork.links;

    // calculate positions of all nodes
    this.find_layers(nodes);
    let nodePositions = this.calculate_node_coordinates(nodes);

    // convert nodes to dom objects
    nodes = nodes.map(node => {
      let id = node.id;
      let position = nodePositions[id];
      let focused = this.state.focusedNodes[id];
      return <Node
        key={id}
        position={position}
        node={node}
        focused={focused}
        onNodeClicked={_ => this.onNodeClicked(id)} />
    });

    // convert links to dom objects
    links = links.map(link => {
      let fromPos = nodePositions[link.source];
      let toPos = nodePositions[link.target];
      let focused = this.state.focusedNodes[link.source] || this.state.focusedNodes[link.target];
      return <Link
        key={link.source + ":" + link.target}
        fromPos={fromPos} toPos={toPos}
        link={link}
        focused={focused} />;
    });

    // return all dom objects
    return links.concat(nodes);
  }

  renderInfoView() {
    const { currentNetwork, index } = this.state;
    if (currentNetwork) {
      return <InfoView nodes={currentNetwork.nodes} links={currentNetwork.links} index={index} />
    }
  }

  render() {
    return (
      <div className="App">
        <input type="file" id="fileInput" onChange={this.onFileUpdated} />
        {this.renderInfoView()}
        <svg width={WIDTH} height={HEIGHT}>
          {this.renderNetwork()}
        </svg>
      </div>
    );
  }
}

export default App;

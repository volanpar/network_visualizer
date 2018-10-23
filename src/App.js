import React, { Component } from 'react';
import './App.css';
import InfoView from './components/InfoView';
import Node from "./components/Node";

const WIDTH = window.innerWidth * 10;
const HEIGHT = window.innerHeight * 10;

const CLR_BACKGROUND = "#f1f1f1";

const CLR_NODE = "#24628c";
const CLR_NODE_ACTIVATED = "red";
const CLR_INPUT_NODE = "#258c8c";
const CLR_OUTPUT_NODE = "#8c2488";
const CLR_REWARD_NODE = "#8c8c24";

const CLR_LINK = "#505a60";
const CLR_LINK_TEXT = "#444444";

const N_CORNER = 3; // rounded corner
const N_WIDTH = 12; // NODE width
const N_WIDTH_FOCUS = 18; // when focused
const N_FONT_SIZE = 8;

const INFO_CORNER = 6; // rounded corner background
const INFO_GAP_N = 28; // gap between node/synapse and info window
const INFO_GAP_E = 18; // gap between node/synapse and info window

const LINEWIDTH = 1.0;
const LINEWIDTH_OPACITY = 0.1;
const LINEWIDTH_OPACITY_FOCUS = 0.6;
const LINK_FONT_SIZE = 7;

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
      focusedNodes: []
    }

    this.onFileUpdated = this.onFileUpdated.bind(this);
    this.parseMeta = this.parseMeta.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
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
      let focusedNodes = [];

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


  // RENDERING

  renderNodes() {
    if (!this.state.currentNetwork) {
      return;
    }

    let nodes = this.state.currentNetwork.nodes;

    let nodePositions = this.calculate_node_coordinates(nodes);

    return nodes.map(node => {
      let id = node.id;
      let position = nodePositions[id];
      return <Node key={id} id={id} position={position} />
    });
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
          {this.renderNodes()}
        </svg>
      </div>
    );
  }
}

export default App;

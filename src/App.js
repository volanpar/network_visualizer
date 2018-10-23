import React, { Component } from 'react';
import './App.css';
import Network from "./components/Network";
import InfoView from './components/InfoView';

class App extends Component {

  constructor() {
    super();

    this.state = {
      index: 0,
      sequence: [],
      meta: {},
      network: null
    }

    this.onFileUpdated = this.onFileUpdated.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyPress);
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

      // parse to json  
      let data = JSON.parse(reader.result);

      // set new state
      this.setState(_ => { return { index: 0, sequence: data.sequence, meta: data.meta } });
    }

    // start reading first file
    reader.readAsText(event.target.files[0])
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
        let network = sequence[index];
        return {
          ...prevState,
          index,
          network,
        }
      });
    }
  }

  previous() {
    let { index, sequence } = this.state;
    if (index > 0) {
      this.setState(prevState => {
        index -= 1;
        let network = sequence[index];
        return {
          ...prevState,
          index,
          network,
        }
      });
    }
  }

  renderNetwork() {
    const { network } = this.state;
    if (network) {
      return <Network nodes={network.nodes} links={network.links} />
    }
  }

  renderInfoView() {
    const { network, index } = this.state;
    if (network) {
      return <InfoView nodes={network.nodes} links={network.links} index={index} />
    }
  }

  render() {
    return (
      <div className="App">
        <input type="file" onChange={this.onFileUpdated} />
        {this.renderInfoView()}
        {this.renderNetwork()}

      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css'
import CanvasChart from "./CanvasChart";
import NetworkGraphData from './NetworkGraph2.json'

class App extends Component {
  render() {
    return (
        <CanvasChart width={960} height={500}  data={NetworkGraphData} />
    );
  }
}





export default App;

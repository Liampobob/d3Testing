import React from 'react';
import {InteractiveForceGraph, ForceGraphNode, ForceGraphArrowLink} from 'react-vis-force';
import NetworkGraphData from './NetworkGraph.json'

let colors = ["red", "blue", "purple", "black", "green", "yellow", "orange", "cyan", "gray", "pink"];
let nodes = NetworkGraphData.nodes;
let links = NetworkGraphData.links;

export default class NetworkGraph extends React.Component {

  render() {
    return(
      <div>
        <InteractiveForceGraph
          simulationOptions={{ height: 600, width: 600, animate: true, strength: {charge: -1000, collide: -5}}}
          animate={true}
          zoomable={true}
          zoom={true}
          labelAttr="label"
          onSelectNode={(event, node) => {
              console.log(event);
              console.log(node);
          }}
          onMouseEnter={(event, node) => {}}
          onDeselectNode={(event, node) => {}}
          highlightDependencies
        >
            {nodes.map( a => this.createNode(a.id, a.label, a.color))}
            {links.map( a => this.createLink(a.source, a.target, a.power))}

        </InteractiveForceGraph>
      </div>

    );
  }

  createNode(uid, labelAttr, colorId) {
    return (
      <ForceGraphNode node={{ id: uid, label: labelAttr}} fill={colors[colorId]} r={10} key={uid}/>
    );
  }

  createLink(nodeOne, nodeTwo, power) {
    return(
      <ForceGraphArrowLink link={{ source: nodeOne, target: nodeTwo, value: 1}} targetRadius={power} key={nodeOne + nodeTwo}/>
    );
  }

}
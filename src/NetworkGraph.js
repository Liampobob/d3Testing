import React from 'react';
import {InteractiveForceGraph, ForceGraphNode, ForceGraphArrowLink, updateSimulation} from 'react-vis-force';
import NetworkGraphData from './NetworkGraph.json'

let colors = ["red", "blue", "purple", "black", "green", "yellow", "orange", "cyan", "gray", "pink"];
let networkGraphNodes = NetworkGraphData.nodes;
let networkGraphLinks = NetworkGraphData.links;

export default class NetworkGraph extends React.Component {

    constructor(props){
        super(props);
        this.state = this.loadNodesAndLinks();
    }

  render() {
    return(
      <div>
          {this.state.graph}
      </div>

    );
  }

  createGraph(ourNodes, ourLinks, alpha){
    return(
      <InteractiveForceGraph
          simulationOptions={{ height: 600, width: 600, animate: true, strength: {charge: -1000, collide: -10}}}
          animate={true}
          zoomable={true}
          zoom={true}
          labelAttr="label"
          onSelectNode={(event, node) => {
              this.loadNewNodesAndLinks(node);
          }}
          onMouseEnter={(event, node) => {}}
          onDeselectNode={(event, node) => {}}
          highlightDependencies = {true}
          alpha={alpha}
      >
          {ourNodes.map( a => this.createNode(a.id, a.label, a.color))}
          {ourLinks.map( a => this.createLink(a.source, a.target, a.power))}

      </InteractiveForceGraph>
    );
  }

  createNode(uid, labelAttr, colorId) {
    return (
      <ForceGraphNode node={{ id: uid, label: labelAttr}} fill={colors[colorId]} r={12} key={uid}/>
    );
  }

  createLink(nodeOne, nodeTwo, power) {
    return(
      <ForceGraphArrowLink link={{ source: nodeOne, target: nodeTwo, value: 1}} targetRadius={power} key={nodeOne + nodeTwo}/>
    );
  }

  loadNodesAndLinks(){
      let nodes = [];
      let links = [];
      networkGraphNodes.forEach( a => {
          if(a.color === this.props.centralUser){
              nodes.push(a);

          }
      } );
      let tmpNodes = [];
      networkGraphLinks.forEach( a => {
          nodes.forEach(b => {
              let bool = true;
              links.forEach(c => {
                  if (a === c) {
                      bool = false;
                  }
              });
              if(bool) {
                  if (b.id === a.source) {
                      links.push(a);
                      tmpNodes.push(a.target);
                  } else if (b.id === a.target) {
                      links.push(a);
                      tmpNodes.push(a.source);
                  }
              }
          });
      });
      tmpNodes.forEach( a => {
          let bool = true;
          nodes.forEach( b => {
              if(a === b.id){
                  bool = false;
              }
          });
          if(bool){
              networkGraphNodes.forEach( b => {
                  if(a === b.id){
                      nodes.push(b);
                  }
              });
          }
      });

      return {nodes: nodes, links:links, graph: this.createGraph(nodes, links, 200)};
  }

  loadNewNodesAndLinks(clickedNode){
        console.log(this.state.graph.props.alpha);
      let nodes = this.state.nodes;
      let links = this.state.links;
      let tmpNodes = [];
      networkGraphLinks.forEach( a => {
          let bool = true;
          links.forEach(c => {
              if (a === c) {
                  bool = false;
              }
          });
          if(bool) {
              if (clickedNode.id === a.source) {
                  links.push(a);
                  tmpNodes.push(a.target);
              } else if (clickedNode.id === a.target) {
                  links.push(a);
                  tmpNodes.push(a.source);
              }
          }
      });
      tmpNodes.forEach( a => {
          let bool = true;
          nodes.forEach( b => {
              if(a === b.id){
                  bool = false;
              }
          });
          if(bool){
              networkGraphNodes.forEach( b => {
                  if(a === b.id){
                      nodes.push(b);
                  }
              });
          }
      });
      this.setState({nodes: nodes, links: links, graph: (this.createGraph(nodes, links, 200))});
    }
}

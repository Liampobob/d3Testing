import React from 'react';
import * as force from 'd3-force';

export default class CanvasChart extends React.Component {

    componentDidMount() {
        let data = this.props.data;
        let canvas = this.canvas;
        let context = canvas.getContext('2d');

        let simulation = force.forceSimulation(data.nodes).force("link", force.forceLink(data.links));

        simulation.on("tick", () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            for(let i in data.nodes) {
                context.fillRect(data.nodes[i].x+100, data.nodes[i].y+100, 10, 10);
            }
        });
    }

    render() {
        return <canvas width={this.props.width} height={this.props.height} ref={(el) => { this.canvas = el }} />
    }
}

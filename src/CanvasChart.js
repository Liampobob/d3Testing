import React from 'react';
import * as d3 from 'd3';

let colors = ["red", "blue", "purple", "black", "green", "yellow", "orange", "cyan", "gray", "pink"];

export default class CanvasChart extends React.Component {

    componentDidMount() {
        let data = this.props.data;
        let canvas = this.canvas;
        let context = canvas.getContext('2d');
        let width = canvas.width;
        let height = canvas.height;

        let simulation = d3.forceSimulation()
            .nodes(data.nodes)
            .force("link", d3.forceLink(data.links).id(function id(d) {
                return d.id;
            }))
            .force("charge", d3.forceManyBody().strength(-75))
            .force("center", d3.forceCenter(width / 2, height / 2));

        simulation
            .on("tick", () => {
                context.clearRect(0, 0, width, height);

                context.strokeStyle = "#aaa";
                for (let d of data.links) {
                    context.beginPath();
                    context.moveTo(d.source.x, d.source.y);
                    context.lineTo(d.target.x, d.target.y);
                    context.stroke();
                }
                
                for (let d of data.nodes) {
                    context.strokeStyle = colors[d.group];
                    context.fillStyle = colors[d.group];
                    context.beginPath();
                    context.moveTo(d.x + 3, d.y);
                    context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
                    context.fill();
                    context.stroke();
                }

            });


        d3.select(canvas)
            .call(d3.drag()
                .container(canvas)
                .subject(this.dragSubject(simulation))
                .on("start", this.dragStarted(simulation))
                .on("drag", this.dragged)
                .on("end", this.dragEnded(simulation)));

    }

    dragStarted(simulation) {
        return (d, i , nodes) => {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d3.event.subject.fx = d3.event.subject.x;
            d3.event.subject.fy = d3.event.subject.y;
        };

    }

    dragged() {
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
    }

    dragEnded(simulation) {
        return (d, i , nodes) => {
            if (!d3.event.active) simulation.alphaTarget(0);
            d3.event.subject.fx = null;
            d3.event.subject.fy = null;
        };
    }

    dragSubject(simulation) {
        return () => {
            return simulation.find(d3.event.x, d3.event.y);
        };
    }

    findById(id) {
        return (element) => {
            return element.id === id;
        };
    }

    render() {
        return <canvas width={this.props.width} height={this.props.height} ref={(el) => { this.canvas = el }} />
    }
}

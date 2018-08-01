import React from 'react';
import * as d3 from 'd3';

let colors = ["red", "blue", "purple", "black", "green", "yellow", "orange", "cyan", "gray", "pink"];
let radius = 5;


export default class CanvasChart extends React.Component {

    canvas;
    context;
    simulation;

    constructor() {
        super();

        this.dragSubject = this.dragSubject.bind(this);
        this.dragEnded = this.dragEnded.bind(this);
        this.dragged = this.dragged.bind(this);
        this.dragStarted = this.dragStarted.bind(this);
        this.zoomed = this.zoomed.bind(this);
        this.draw = this.draw.bind(this);
    }

    componentDidMount() {
        this.context = this.canvas.getContext('2d');

        this.simulation = d3.forceSimulation()
            .nodes(this.props.data.nodes)
            .force("link", d3.forceLink(this.props.data.links).id((d) => {
                return d.id;
            }))
            .force("charge", d3.forceManyBody().strength(-1 * radius * radius))
            .force("center", d3.forceCenter(this.canvas.width/2, this.canvas.height/2));

        this.simulation
            .on("tick", this.draw);

        d3.select(this.canvas)
            .call(d3.drag()
                .container(this.canvas)
                .subject(this.dragSubject)
                .on("start", this.dragStarted)
                .on("drag", this.dragged)
                .on("end", this.dragEnded))
            .call(d3.zoom()
                .on("zoom", this.zoomed))

    }

    draw() {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.strokeStyle = "#aaa";
        for (let d of this.props.data.links) {
            this.context.beginPath();
            this.context.moveTo(d.source.x, d.source.y);
            this.context.lineTo(d.target.x, d.target.y);
            this.context.stroke();
        }

        for (let d of this.props.data.nodes) {
            this.context.strokeStyle = colors[d.group];
            this.context.fillStyle = colors[d.group];
            this.context.beginPath();
            this.context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
            this.context.fill();
            this.context.stroke();
        }

    }

    zoomed() {
            this.context.save();
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.context.translate(d3.event.transform.x, d3.event.transform.y);
            this.context.scale(d3.event.transform.k, d3.event.transform.k);
            this.draw();
            this.context.restore();
    }

    dragStarted() {
        // d3.event.sourceEvent.stopPropagation();
        // d3.select(this.canvas).classed("dragging", true);

        if (!d3.event.active) {
                this.simulation.alphaTarget(0.3).restart();
            }

            d3.event.subject.fx = d3.event.subject.x;
            d3.event.subject.fy = d3.event.subject.y;

    }

    dragged() {
            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;
    }

    dragEnded() {
        // d3.select(this.canvas).classed("dragging", false);

        if (!d3.event.active) {
            this.simulation.alphaTarget(0);
        }
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    }

    dragSubject() {
        let node = this.simulation.find(d3.event.x, d3.event.y, radius);
        return node;
    }

    render() {
        return <canvas width={this.props.width} height={this.props.height} ref={(el) => { this.canvas = el }} />
    }
}

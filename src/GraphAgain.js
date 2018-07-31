import React from 'react';
import * as d3 from 'd3'

export default class GraphAgain extends React.Component {

    componentDidMount() {

        let canvas = document.querySelector("canvas"),
            context = canvas.getContext("2d"),
            width = canvas.width,
            height = canvas.height;

        let simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody().strength())
            .force("center", d3.forceCenter());

        d3.json("NetworkGraph2.json", function(error, graph) {
            if (error) throw error;

            simulation
                .nodes(graph.nodes)
                .on("tick", ticked);

            d3.select(canvas)
                .call(d3.drag()
                    .container(canvas)
                    .subject(dragsubject)
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            function ticked() {
                context.clearRect(0, 0, width, height);

                context.beginPath();
                graph.links.forEach(drawLink);
                context.strokeStyle = "#aaa";
                context.stroke();

                context.beginPath();
                graph.nodes.forEach(drawNode);
                context.fill();
                context.strokeStyle = "#fff";
                context.stroke();
            }

            function dragsubject() {
                return simulation.find(d3.event.x, d3.event.y);
            }
        });

        function dragstarted() {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d3.event.subject.fx = d3.event.subject.x;
            d3.event.subject.fy = d3.event.subject.y;
        }

        function dragged() {
            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;
        }

        function dragended() {
            if (!d3.event.active) simulation.alphaTarget(0);
            d3.event.subject.fx = null;
            d3.event.subject.fy = null;
        }

        function drawLink(d) {
            context.moveTo(d.source.x, d.source.y);
            context.lineTo(d.target.x, d.target.y);
        }

        function drawNode(d) {
            context.moveTo(d.x + 3, d.y);
            context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
        }

    }

    render() {
        return <canvas width={this.props.width} height={this.props.height} ref={(el) => { this.canvas = el }} />
    }
}

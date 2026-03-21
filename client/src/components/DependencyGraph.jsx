import { useRef, useEffect } from 'react'
import * as d3 from 'd3'

function DependencyGraph({ dependencies }) {
    const svgRef = useRef(null)

    useEffect(() => {
        if (!dependencies || dependencies.length === 0) return

        let simulation;

        const timer = setTimeout(() => {
            if (!svgRef.current) return;

            const width = svgRef.current.parentElement?.clientWidth || 900;
            const height = 600;

            // Build nodes from unique file names
            const nodeSet = new Set();
            dependencies.forEach(d => {
                nodeSet.add(d.from);
                nodeSet.add(d.to);
            });
            const nodes = Array.from(nodeSet).map(id => ({ id }));

            // Build links
            const links = dependencies.map(d => ({
                source: d.from,
                target: d.to
            }));

            // Clear previous render
            d3.select(svgRef.current).selectAll("*").remove();

            // Create SVG
            const svg = d3.select(svgRef.current)
                .attr("width", width)
                .attr("height", height);

            // Add zooming capability and group
            const g = svg.append("g");
            const zoom = d3.zoom()
                .scaleExtent([0.1, 4])
                .on("zoom", (event) => {
                    g.attr("transform", event.transform);
                });
            svg.call(zoom);

            // Force simulation
            simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id).distance(100))
                .force("charge", d3.forceManyBody().strength(-300))
                .force("center", d3.forceCenter(width / 2, height / 2));

            // Draw links
            const link = g.append("g")
                .selectAll("line")
                .data(links)
                .enter().append("line")
                .attr("stroke", "#38bdf8")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5);

            // Draw nodes
            const node = g.append("g")
                .selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("r", 8)
                .attr("fill", "#38bdf8")
                .call(d3.drag()
                    .on("start", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0.3).restart();
                        d.fx = d.x; d.fy = d.y;
                    })
                    .on("drag", (event, d) => {
                        d.fx = event.x; d.fy = event.y;
                    })
                    .on("end", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0);
                        d.fx = null; d.fy = null;
                    })
                );

            // Draw labels
            const label = g.append("g")
                .selectAll("text")
                .data(nodes)
                .enter().append("text")
                .text(d => d.id.split('/').pop())
                .attr("font-size", 10)
                .attr("fill", "#94a3b8")
                .attr("dx", 12)
                .attr("dy", 4);

            // Update positions on each tick
            simulation.on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);
                
                // Remove clamping to allow natural spread
                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
                
                label
                    .attr("x", d => d.x)
                    .attr("y", d => d.y);

                // Auto-center and fit to screen using viewBox
                if (nodes.length > 0) {
                    const padding = 60;
                    let xMin = d3.min(nodes, d => d.x) - padding;
                    let xMax = d3.max(nodes, d => d.x) + padding;
                    let yMin = d3.min(nodes, d => d.y) - padding;
                    let yMax = d3.max(nodes, d => d.y) + padding;
                    
                    let vbWidth = xMax - xMin;
                    let vbHeight = yMax - yMin;

                    // Prevent extreme zoom-in if graph is small
                    if (vbWidth < width) {
                        xMin = (xMin + xMax) / 2 - width / 2;
                        vbWidth = width;
                    }
                    if (vbHeight < height) {
                        yMin = (yMin + yMax) / 2 - height / 2;
                        vbHeight = height;
                    }

                    svg.attr("viewBox", `${xMin} ${yMin} ${vbWidth} ${vbHeight}`);
                }
            });

        }, 100);

        return () => {
            clearTimeout(timer);
            if (simulation) simulation.stop();
        };

    }, [dependencies])

    return <svg ref={svgRef} style={{ background: 'transparent', width: '100%', height: '600px' }}></svg>
}

export default DependencyGraph

/* eslint-disable */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GridFloor() {
    const gridRef = useRef();
    const nodesRef = useRef();

    // Create an array of node positions along the grid
    const { positions, connectLines } = useMemo(() => {
        const pos = [];
        const lines = [];
        const size = 40;
        const divisions = 20;
        const step = size / divisions;

        // Generate some random nodes on the grid intersections
        for (let i = 0; i < 40; i++) {
            const x = (Math.floor(Math.random() * divisions) - divisions / 2) * step;
            const z = (Math.floor(Math.random() * divisions) - divisions / 2) * step;
            // start underground, will rise up via animation
            pos.push(new THREE.Vector3(x, -2, z));
        }

        // Create connection lines between nearby nodes
        for (let i = 0; i < pos.length; i++) {
            for (let j = i + 1; j < pos.length; j++) {
                if (pos[i].distanceTo(pos[j]) < 8) {
                    lines.push(pos[i], pos[j]);
                }
            }
        }
        return { positions: pos, connectLines: lines };
    }, []);

    const nodesGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const posArray = new Float32Array(positions.length * 3);
        positions.forEach((p, i) => {
            posArray[i * 3] = p.x;
            posArray[i * 3 + 1] = p.y;
            posArray[i * 3 + 2] = p.z;
        });
        geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        return geo;
    }, [positions]);

    const linesGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry().setFromPoints(connectLines);
        return geo;
    }, [connectLines]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Slowly move grid floor to simulate forward movement
        if (gridRef.current) {
            gridRef.current.position.z = (time * 1.5) % 2;
        }

        // Animate nodes rising and pulsing
        if (nodesRef.current) {
            const positionsAttr = nodesGeometry.attributes.position;
            const scrollY = window.scrollY || 0;
            const riseFactor = Math.min(scrollY / 1000, 1); // 0 to 1 based on scroll

            for (let i = 0; i < positions.length; i++) {
                const p = positions[i];
                // Base rise + scroll rise + subtle hover
                const targetY = (p.x % 3 === 0 ? 0.5 : 0.2) + riseFactor * 4;
                const currentY = positionsAttr.getY(i);
                // Smooth interpolation
                const newY = THREE.MathUtils.lerp(currentY, targetY + Math.sin(time * 2 + i) * 0.2, 0.05);
                positionsAttr.setY(i, newY);
            }
            positionsAttr.needsUpdate = true;

            // Update lines based on new node positions
            const linesAttr = linesGeometry.attributes.position;
            let lineIdx = 0;
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    if (positions[i].distanceTo(positions[j]) < 8) {
                        linesAttr.setY(lineIdx * 2, positionsAttr.getY(i));
                        linesAttr.setY(lineIdx * 2 + 1, positionsAttr.getY(j));
                        lineIdx++;
                    }
                }
            }
            linesAttr.needsUpdate = true;
        }
    });

    return (
        <group>
            {/* Infinite Grid Helper */}
            <mesh ref={gridRef} position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[100, 100, 50, 50]} />
                <meshBasicMaterial
                    color="#00f0ff"
                    wireframe
                    transparent
                    opacity={0.15}
                    side={THREE.DoubleSide}
                />
            </mesh>

            <group ref={nodesRef}>
                {/* Nodes */}
                <points geometry={nodesGeometry}>
                    <pointsMaterial
                        color="#00f0ff"
                        size={0.15}
                        transparent
                        opacity={0.8}
                        blending={THREE.AdditiveBlending}
                    />
                </points>
                {/* Connections */}
                <lineSegments geometry={linesGeometry}>
                    <lineBasicMaterial
                        color="#0057ff"
                        transparent
                        opacity={0.3}
                        blending={THREE.AdditiveBlending}
                    />
                </lineSegments>
            </group>
        </group>
    );
}

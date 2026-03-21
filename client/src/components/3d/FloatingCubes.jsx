/* eslint-disable */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, Edges } from '@react-three/drei';
import * as THREE from 'three';

const LANGUAGES = [
    { name: 'JavaScript', color: '#f1e05a', size: [1.2, 1.2, 1.2] },
    { name: 'HTML', color: '#e34c26', size: [1.0, 1.0, 1.0] },
    { name: 'CSS', color: '#563d7c', size: [0.8, 0.8, 0.8] },
    { name: 'Python', color: '#3572A5', size: [1.5, 1.5, 1.5] },
    { name: 'TypeScript', color: '#3178c6', size: [1.3, 1.3, 1.3] },
];

export default function FloatingCubes() {
    const group = useRef();

    // Create highly dynamic cubes, positioned away from the center to keep text legible
    const cubes = useMemo(() => {
        return Array.from({ length: 18 }).map((_, i) => {
            const type = LANGUAGES[i % LANGUAGES.length];
            const scale = 0.6 + Math.random() * 0.4;
            const finalSize = [type.size[0] * scale, type.size[1] * scale, type.size[2] * scale];

            // Keep cubes out of the screen's center
            const signX = Math.random() > 0.5 ? 1 : -1;
            // If right side, push further right (8 to 16), otherwise left side (-5 to -12)
            const posX = signX === 1
                ? 8 + Math.random() * 8
                : -5 - Math.random() * 7;

            // Position them vertically around the view
            const posY = Math.random() * 10 - 2;

            // Push them back so they form a beautiful framing background
            const posZ = -6 - Math.random() * 8;

            const pos = [posX, posY, posZ];

            return {
                id: i,
                pos,
                name: type.name,
                color: type.color,
                size: finalSize,
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
                speed: 1.5 + Math.random() * 2,
            };
        });
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (group.current) {
            group.current.rotation.y = Math.sin(time * 0.08) * 0.15;
        }
    });

    return (
        <group ref={group}>
            {cubes.map((cube) => (
                <Float
                    key={cube.id}
                    speed={cube.speed}
                    rotationIntensity={1.2}
                    floatIntensity={2.5}
                    position={cube.pos}
                >
                    <group rotation={cube.rotation}>
                        {/* Inner glowing core */}
                        <mesh castShadow receiveShadow scale={0.6}>
                            <boxGeometry args={cube.size} />
                            <meshStandardMaterial attach="material" color={cube.color} emissive={cube.color} emissiveIntensity={1} toneMapped={false} />
                        </mesh>

                        {/* Solid material with decreased translucency */}
                        <mesh castShadow receiveShadow>
                            <boxGeometry args={cube.size} />
                            <meshPhysicalMaterial
                                color="#202025"
                                transparent
                                opacity={0.7}
                                roughness={0.2}
                                clearcoat={1}
                                clearcoatRoughness={0.2}
                            />
                            <Edges scale={1.01} color={cube.color} opacity={0.9} transparent />
                        </mesh>

                        {/* DOM Overlay Label */}
                        <Html
                            center
                            zIndexRange={[100, 0]}
                            distanceFactor={10}
                        >
                            <div style={{
                                background: 'rgba(10, 10, 12, 0.85)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: `1px solid ${cube.color}88`,
                                padding: '6px 14px',
                                borderRadius: '6px',
                                color: 'white',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: '14px',
                                letterSpacing: '0.5px',
                                boxShadow: `0 4px 12px ${cube.color}44`,
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                            }}>
                                <span style={{ color: cube.color, marginRight: '6px' }}>●</span>
                                {cube.name}
                            </div>
                        </Html>
                    </group>
                </Float>
            ))}
        </group>
    );
}

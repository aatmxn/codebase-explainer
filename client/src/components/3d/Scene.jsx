import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import FloatingCubes from './FloatingCubes';
import CameraRig from './CameraRig';

export default function Scene({ showFloatingCubes = true }) {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 2, 10], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
        >
            <color attach="background" args={['#08080a']} />
            <fog attach="fog" args={['#08080a', 5, 30]} />

            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} color="#38bdf8" />
            <directionalLight position={[-10, 10, -5]} intensity={1.2} color="#818cf8" />

            <Suspense fallback={null}>
                <CameraRig />
                {showFloatingCubes ? <FloatingCubes /> : null}
                <Environment preset="night" />
            </Suspense>
        </Canvas>
    );
}

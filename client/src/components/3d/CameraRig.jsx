import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraRig() {
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Mouse parallax effect
        const mouseX = (state.pointer.x * window.innerWidth) / 2;
        const mouseY = (state.pointer.y * window.innerHeight) / 2;

        // Target position based on mouse
        const targetX = (mouseX * 0.002);
        const targetY = 2 + (mouseY * 0.002);

        // Scroll-based forward movement (simulating diving into code)
        const scrollY = window.scrollY || 0;
        const scrollZOffset = Math.min(scrollY / 100, 6); // Move forward up to 6 units

        const targetZ = 12 - scrollZOffset;

        // Smooth camera interpolation
        state.camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05);

        // Subtle breathing or floating of camera focus point
        const lookAtX = Math.sin(t * 0.5) * 0.5;
        const lookAtY = 2 + Math.cos(t * 0.4) * 0.5;

        const targetLookAt = new THREE.Vector3(lookAtX, lookAtY, 0);
        state.camera.lookAt(targetLookAt);
    });

    return null;
}

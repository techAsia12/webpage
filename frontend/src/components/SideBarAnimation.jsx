import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * LevitationCube Component
 * 
 * A 3D cube that levitates up and down using a sine wave animation.
 * 
 * @param {Object} props - Component props
 * @param {number} props.size - The size of the cube (default: 5)
 * @param {number} props.amplitude - The amplitude of the levitation animation (default: 0.5)
 * @param {number} props.frequency - The frequency of the levitation animation (default: 1)
 * @returns {JSX.Element} - Rendered LevitationCube component
 */
const LevitationCube = ({ size = 5, amplitude = 0.5, frequency = 1 }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animation loop for levitation effect
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(time * frequency) * amplitude;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={hovered ? "white" : "#BBBBBB"} />
    </mesh>
  );
};

/**
 * SideBarAnimation Component
 * 
 * A 3D scene containing a levitating cube with orbit controls.
 * 
 * @returns {JSX.Element} - Rendered SideBarAnimation component
 */
const SideBarAnimation = () => {
  return (
    <Canvas
      camera={{ position: [5, 5, 5] }}
      className="hidden lg:block"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* Levitating Cube */}
      <LevitationCube size={5} amplitude={0.5} frequency={1} />

      {/* Orbit Controls for Camera */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={15}
      />
    </Canvas>
  );
};

export default SideBarAnimation;
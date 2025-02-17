import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";

const LevitationCube = () => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame(({ clock }) => {
      const time = clock.getElapsedTime();
      const amplitude = 0.5; 
      const frequency = 1; 
      meshRef.current.position.y = Math.sin(time * frequency) * amplitude; 
    });
  
    return (
      <mesh
        ref={meshRef}
        position={[0, 0, 0]} 
      >
        <boxGeometry args={[5, 5, 5]} />
        <meshStandardMaterial  />
      </mesh>
    );
  };

const SideBarAnimation = () => {
  return (
    <Canvas camera={{ position: [5, 5, 5] }} className="hidden lg:block">
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <LevitationCube />
      <OrbitControls /> 
    </Canvas>
  )
}

export default SideBarAnimation
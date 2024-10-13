import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Tile from "./Tile";

export default function BoardGame() {
  const gridSize = 50; // Adjust as needed

  // Generate initial tile positions
  const tiles = [
    { id: 1, position: [0, 0, 0] },
    { id: 2, position: [1, 0, 0] },
    // Add more tiles as needed
  ];

  return (
    <Canvas
      style={{ height: "100vh" }}
      shadows
      camera={{ position: [0, 5, 10], fov: 50 }}
    >
      {/* **Exponential Fog** */}
      <fogExp2 attach="fog" args={["#a0a0a0", 0.0005]} />
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 7.5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
      />

      {/* Grid */}
      <gridHelper args={[gridSize, gridSize]} />

      {/* Tiles */}
      {tiles.map((tile) => (
        <Tile key={tile.id} position={tile.position} />
      ))}
    </Canvas>
  );
}

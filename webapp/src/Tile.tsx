import React, { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { Vector3 } from "three";

interface TileProps {
  position: [number, number, number];
}

const Tile: React.FC<TileProps> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // Position state
  const [tilePosition, setTilePosition] = React.useState<Vector3>(
    new Vector3(...position),
  );

  // Drag logic
  const bind = useDrag(
    ({ offset: [x, y] }) => {
      // Convert screen coordinates to world coordinates
      const newX = x / aspect;
      const newZ = -(y / aspect);

      // Snap to grid logic
      const snappedX = Math.round(newX);
      const snappedZ = Math.round(newZ);

      setTilePosition(new Vector3(snappedX, 0, snappedZ));
    },
    { pointerEvents: true },
  );

  return (
    <mesh
      ref={meshRef}
      position={tilePosition}
      {...bind()}
      castShadow
      receiveShadow
    >
      {/* Replace with your tile geometry and material */}
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default Tile;

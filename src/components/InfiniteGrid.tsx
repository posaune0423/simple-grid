import { OrbitControls } from '@react-three/drei';
import { Canvas, ThreeEvent } from '@react-three/fiber';
// @deno-types="@types/react"
import { useCallback, useRef, useState } from 'react';
// @deno-types="@types/three"
import { Euler, MOUSE, TOUCH, Vector3 } from 'three';

const CELL_SIZE = 100000;
const BORDER_COLOR = 0x888888;
const rotation = new Euler(-Math.PI / 2, 0, 0);

// function to convert coordinates to a key
const coordToKey = (x: number, y: number) => `${x}-${y}`;

export const InfiniteGrid: React.FC = () => {
  const [coloredCoordinates, setColoredCoordinates] = useState<Map<string, Vector3>>(new Map());

  const isPanning = useRef(false);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (pointerDownPos.current) {
      const dx = Math.abs(e.clientX - pointerDownPos.current.x);
      const dy = Math.abs(e.clientY - pointerDownPos.current.y);
      // If the mouse has moved a certain distance, consider it a pan operation
      isPanning.current = dx > 5 || dy > 5;
      setTimeout(() => {
        isPanning.current = false;
        pointerDownPos.current = null;
      }, 10);
    }
  };

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    if (isPanning.current) return;

    // Stop event propagation
    event.stopPropagation();

    if (event.intersections.length > 0) {
      // Calculate the average point of all intersections
      const avgPoint = event.intersections.reduce((acc, intersection) => {
        acc.x += intersection.point.x;
        acc.y += intersection.point.y;
        return acc;
      }, new Vector3(0, 0, 0)).divideScalar(event.intersections.length);

      const x = avgPoint.x >= 0 ? Math.floor(avgPoint.x) + 0.5 : Math.ceil(avgPoint.x) - 0.5;
      const y = avgPoint.y >= 0 ? Math.floor(avgPoint.y) + 0.5 : Math.ceil(avgPoint.y) - 0.5;

      const key = coordToKey(x, y);

      setColoredCoordinates((prev) => {
        const next = new Map(prev);
        if (!next.has(key)) {
          next.set(key, new Vector3(x, y, 0));
        }
        return next;
      });
    }
  }, []);

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <gridHelper
        args={[CELL_SIZE, CELL_SIZE, BORDER_COLOR, BORDER_COLOR]}
        rotation={rotation}
        castShadow={false}
        onClick={handleClick}
      />

      {/* Map の values() を使用して座標を描画 */}
      {Array.from(coloredCoordinates.values()).map((coordinate, index) => (
        <mesh key={index} position={coordinate}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color={0x00ff00} transparent opacity={0.5} />
        </mesh>
      ))}

      <OrbitControls
        enableRotate={false}
        enablePan={true}
        enableDamping={true}
        screenSpacePanning={true}
        mouseButtons={{
          LEFT: MOUSE.PAN,
          MIDDLE: MOUSE.PAN,
          RIGHT: MOUSE.PAN,
        }}
        touches={{
          ONE: TOUCH.PAN,
          TWO: TOUCH.DOLLY_PAN,
        }}
      />
    </Canvas>
  );
};

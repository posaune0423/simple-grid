import { OrbitControls } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
// @deno-types="@types/react"
import { useCallback, useMemo, useState } from 'react';
// @deno-types="@types/three"
import { Euler, MOUSE, TOUCH, Vector3 } from 'three';

const CELL_SIZE = 100000;
const BORDER_COLOR = 0x888888;
const rotation = new Euler(-Math.PI / 2, 0, 0);

// function to convert coordinates to a key
const coordToKey = (x: number, y: number) => `${x}-${y}`;

export const InfiniteGrid: React.FC<{
  isPanning: React.MutableRefObject<boolean>;
}> = ({ isPanning }) => {
  const [coloredCoordinates, setColoredCoordinates] = useState<Map<string, Vector3>>(
    new Map(),
  );

  const coloredCoordinatesArray = useMemo(
    () => Array.from(coloredCoordinates.values()),
    [coloredCoordinates],
  );

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
  }, [isPanning]);

  return (
    <>
      <gridHelper
        args={[CELL_SIZE, CELL_SIZE, BORDER_COLOR, BORDER_COLOR]}
        rotation={rotation}
        castShadow={false}
        onClick={handleClick}
      />

      {coloredCoordinatesArray.map((coordinate, index) => (
        <mesh key={index} position={coordinate}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color={0x00ff00} transparent opacity={0.5} />
        </mesh>
      ))}

      <OrbitControls
        enableRotate={false}
        enablePan={true}
        enableDamping={true}
        minDistance={6}
        maxDistance={36}
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
    </>
  );
};

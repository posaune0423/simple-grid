import { InfiniteGrid } from './components/InfiniteGrid.tsx';
import { Canvas } from '@react-three/fiber';
// @deno-types="@types/react"
import { useRef } from 'react';

const App = () => {
  const isPanning = useRef(false);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
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
  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <InfiniteGrid isPanning={isPanning} />
    </Canvas>
  );
};

export default App;

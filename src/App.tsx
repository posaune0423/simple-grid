import { Canvas } from '@react-three/fiber'
import { InfiniteGrid } from './components/InfiniteGrid.tsx'

const App = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <InfiniteGrid />
    </Canvas>
  )
}

export default App

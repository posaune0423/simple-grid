import { OrbitControls } from '@react-three/drei'
import { MOUSE, TOUCH, Euler } from 'three'

export const InfiniteGrid: React.FC = () => {
  const CELL_SIZE = 100000 // > 65535 = Max size for uint16
  const BORDER_COLOR = 0x888888
  const rotation = new Euler(-Math.PI / 2, 0, 0)

  return (
    <>
      <gridHelper
        args={[CELL_SIZE, CELL_SIZE, BORDER_COLOR, BORDER_COLOR]}
        rotation={rotation}
        castShadow={false}
      />
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
    </>
  )
}

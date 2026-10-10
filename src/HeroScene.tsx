import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

function FloatingObjects() {
  const cube = useRef<Mesh>(null)
  const ring = useRef<Mesh>(null)
  const coralShape = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (cube.current) {
      cube.current.rotation.x = -0.38 + Math.sin(time * 0.3) * 0.08
      cube.current.rotation.y = time * 0.2
      cube.current.position.y = Math.sin(time * 0.75) * 0.12
    }
    if (ring.current) {
      ring.current.rotation.x = time * 0.18
      ring.current.rotation.y = 0.55 + Math.sin(time * 0.4) * 0.16
    }
    if (coralShape.current) {
      coralShape.current.rotation.x = time * 0.22
      coralShape.current.rotation.z = time * 0.28
    }
  })

  return (
    <>
      <ambientLight intensity={1.45} />
      <directionalLight position={[4, 5, 5]} intensity={3} />
      <pointLight position={[-4, -2, 2]} intensity={1.4} color="#9dbbff" />
      <mesh ref={cube}>
        <boxGeometry args={[1.55, 1.55, 1.55]} />
        <meshStandardMaterial color="#0752f4" metalness={0.38} roughness={0.24} />
      </mesh>
      <mesh ref={ring} position={[-1.5, 0.9, -0.5]}>
        <torusGeometry args={[0.38, 0.055, 14, 56]} />
        <meshStandardMaterial color="#d8f269" metalness={0.16} roughness={0.32} />
      </mesh>
      <mesh ref={coralShape} position={[1.45, 0.92, -0.3]}>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#ff8268" metalness={0.24} roughness={0.3} />
      </mesh>
      <mesh position={[1.55, -1.15, -0.6]} rotation={[0.35, 0.45, 0]}>
        <octahedronGeometry args={[0.24]} />
        <meshStandardMaterial color="#19366e" metalness={0.3} roughness={0.3} />
      </mesh>
    </>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      className="hero-canvas"
      camera={{ position: [0, 0, 7], fov: 36 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      aria-hidden="true"
    >
      <FloatingObjects />
    </Canvas>
  )
}
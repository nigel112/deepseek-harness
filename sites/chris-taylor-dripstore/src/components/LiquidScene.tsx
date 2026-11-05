import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, MeshDistortMaterial, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const pointer = { x: 0, y: 0 }

function useWindowPointer() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
}

function ChromeDrop() {
  const group = useRef<THREE.Group>(null)
  const drop = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y += delta * 0.14
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, 0.72 + pointer.x * 0.42, 2.4, delta)
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, -0.12 + pointer.y * 0.3, 2.4, delta)
      group.current.rotation.z = Math.sin(t * 0.24) * 0.09
    }
    if (drop.current) {
      drop.current.rotation.z = Math.sin(t * 0.18) * 0.2
    }
  })

  return (
    <group ref={group}>
      {/* the liquid chrome pour */}
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.7}>
        <mesh ref={drop} scale={1.42}>
          <sphereGeometry args={[1, 128, 128]} />
          <MeshDistortMaterial
            color="#f2f4f6"
            metalness={1}
            roughness={0.045}
            envMapIntensity={2.1}
            distort={0.32}
            speed={1.25}
            radius={1}
          />
        </mesh>
      </Float>

      {/* glass collar */}
      <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh rotation={[1.15, 0.25, 0.55]} scale={1.02}>
          <torusGeometry args={[2.05, 0.135, 64, 220]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.06}
            roughness={0.035}
            transparent
            opacity={0.42}
            envMapIntensity={4}
            clearcoat={1}
            clearcoatRoughness={0.03}
            ior={1.52}
          />
        </mesh>
      </Float>

      {/* two chrome satellites */}
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.6}>
        <mesh position={[1.95, -1.15, 0.6]} scale={0.24}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial color="#e9edf0" metalness={1} roughness={0.08} envMapIntensity={2.4} />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1.2}>
        <mesh position={[-1.85, 1.35, -0.4]} scale={0.16}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#d8ff3d" metalness={0.85} roughness={0.22} envMapIntensity={1.8} />
        </mesh>
      </Float>
    </group>
  )
}

function Scene() {
  useWindowPointer()
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-6, -2, 2]} intensity={0.7} color="#9fb4c8" />
      <ChromeDrop />
      <Sparkles count={26} scale={7} size={1.6} speed={0.22} opacity={0.55} color="#d8ff3d" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#080809']} />
        <Lightformer form="rect" intensity={7} color="#ffffff" position={[4, 3, 3]} scale={[7, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={4} color="#c8d4e0" position={[-5, -1, 2]} scale={[5, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={9} color="#ffffff" position={[0, 5, -2]} scale={[4, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={5} color="#d8ff3d" position={[-2.5, 2.5, 3]} scale={[3, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.5} color="#4a5560" position={[0, -4, 1]} scale={[8, 4, 1]} target={[0, 0, 0]} />
      </Environment>
    </>
  )
}

export default function LiquidScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.4], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.08
      }}
      style={{ pointerEvents: 'none' }}
    >
      <Scene />
    </Canvas>
  )
}

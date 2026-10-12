import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { conditionColor } from '@/engine/deterioration'
import { usePlatform, useSiteBundle } from '@/context/PlatformState'
import type { Forecast, Structure, TwinViewMode } from '@/types'

function structureValue(
  structure: Structure,
  viewMode: TwinViewMode,
  degraded: Forecast[],
  conserved: Forecast[],
) {
  if (viewMode === 'current') return structure.baselineCondition
  if (viewMode === 'degradation') {
    return degraded.find((f) => f.structureId === structure.id)?.projectedCondition ?? structure.baselineCondition
  }
  return conserved.find((f) => f.structureId === structure.id)?.projectedCondition ?? structure.baselineCondition
}

function MeshStructure({
  structure,
  value,
}: {
  structure: Structure
  value: number
}) {
  const { selectedStructureId, hoveredStructureId, setSelectedStructureId, setHoveredStructureId } =
    usePlatform()
  const selected = selectedStructureId === structure.id
  const hovered = hoveredStructureId === structure.id
  const color = conditionColor(value)
  const [w, h, d] = structure.mesh.size
  const isCylinder = structure.id === 'str-granary'

  return (
    <mesh
      position={structure.mesh.position}
      rotation={[0, structure.mesh.rotationY ?? 0, 0]}
      castShadow
      receiveShadow
      onPointerOver={(e) => {
        e.stopPropagation()
        setHoveredStructureId(structure.id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHoveredStructureId(null)
        document.body.style.cursor = 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedStructureId(structure.id)
      }}
    >
      {isCylinder ? <cylinderGeometry args={[w / 2, w / 2.3, h, 16]} /> : <boxGeometry args={[w, h, d]} />}
      <meshStandardMaterial
        color={color}
        roughness={0.88}
        metalness={0.02}
        emissive={selected || hovered ? '#a7864d' : '#000000'}
        emissiveIntensity={selected ? 0.28 : hovered ? 0.16 : 0}
      />
    </mesh>
  )
}

function Terrain() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[42, 42, 24, 24]} />
        <meshStandardMaterial color="#cbb892" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9.5, 0.04, 0.4]} receiveShadow>
        <planeGeometry args={[4.2, 18]} />
        <meshStandardMaterial color="#8fa0a4" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 0.35, -14]}>
        <boxGeometry args={[18, 0.7, 4]} />
        <meshStandardMaterial color="#b9a57a" />
      </mesh>
    </group>
  )
}

export function SiteScene() {
  const controls = useRef<{ reset: () => void } | null>(null)
  const { structures, degraded, conserved } = useSiteBundle()
  const { viewMode, hoveredStructureId, setSelectedStructureId } = usePlatform()
  const hovered = structures.find((s) => s.id === hoveredStructureId)

  const values = useMemo(
    () =>
      Object.fromEntries(
        structures.map((s) => [s.id, structureValue(s, viewMode, degraded, conserved)]),
      ) as Record<string, number>,
    [structures, viewMode, degraded, conserved],
  )

  return (
    <div className="twin-frame">
      <Canvas
        shadows
        camera={{ position: [16, 12, 16], fov: 42 }}
        onPointerMissed={() => setSelectedStructureId(null)}
      >
        <color attach="background" args={['#e4d7be']} />
        <hemisphereLight args={['#f7f0de', '#7a6248', 0.95]} />
        <directionalLight position={[12, 18, 8]} intensity={1.15} castShadow />
        <Terrain />
        {structures.map((s) => (
          <MeshStructure key={s.id} structure={s} value={values[s.id]} />
        ))}
        <ContactShadows opacity={0.25} scale={28} blur={2.2} far={12} />
        <OrbitControls
          ref={controls as never}
          makeDefault
          minDistance={8}
          maxDistance={36}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
      <div className="legend">
        <div className="label">Spatial risk overlay</div>
        <span>
          <i className="swatch" style={{ background: '#6b7a4a' }} /> Higher index
        </span>
        <span>
          <i className="swatch" style={{ background: '#a7864d' }} /> Moderate
        </span>
        <span>
          <i className="swatch" style={{ background: '#b56a3c' }} /> Elevated concern
        </span>
        <span>
          <i className="swatch" style={{ background: '#8a3f32' }} /> Lowest index
        </span>
        <p className="muted" style={{ margin: '0.4rem 0 0', maxWidth: 180 }}>
          Colour encodes the demonstration condition index, not verified material loss. Drainage band is
          procedural.
        </p>
      </div>
      {hovered && (
        <div
          className="card"
          style={{ position: 'absolute', left: 12, top: 12, zIndex: 2, maxWidth: 260, padding: '0.7rem' }}
        >
          <div className="label">Hover</div>
          <strong>{hovered.name}</strong>
          <div className="muted">
            Index {values[hovered.id].toFixed(1)} · {hovered.kind}
          </div>
        </div>
      )}
      <button
        className="btn secondary"
        style={{ position: 'absolute', left: 12, bottom: 12, zIndex: 2 }}
        onClick={() => controls.current?.reset()}
        type="button"
      >
        Reset camera
      </button>
    </div>
  )
}

export function TwinToolbar() {
  const { viewMode, setViewMode } = usePlatform()
  const modes: { id: TwinViewMode; label: string }[] = [
    { id: 'current', label: 'Current condition' },
    { id: 'degradation', label: 'Future degradation' },
    { id: 'intervention', label: 'Conservation scenario' },
  ]
  return (
    <div className="toolbar">
      {modes.map((m) => (
        <button
          key={m.id}
          type="button"
          className={viewMode === m.id ? 'btn' : 'btn secondary'}
          onClick={() => setViewMode(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}

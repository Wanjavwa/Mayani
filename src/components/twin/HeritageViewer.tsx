import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import { usePlatform } from '@/context/PlatformState'
import type { HeritageAsset, HeritageFeature } from '@/data/heritageAssets'

function FeatureMarker({
  feature,
  selected,
  onSelect,
}: {
  feature: HeritageFeature
  selected: boolean
  onSelect: () => void
}) {
  const [x, y, z] = feature.anchor

  return (
    <group position={[x, y, z]}>
      <mesh onClick={(event) => {
        event.stopPropagation()
        onSelect()
      }}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial
          color={selected ? '#a7864d' : '#65432f'}
          emissive={selected ? '#a7864d' : '#000000'}
          emissiveIntensity={selected ? 0.5 : 0.08}
        />
      </mesh>
      {selected && (
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.5, 32]} />
          <meshBasicMaterial color="#a7864d" transparent opacity={0.7} side={2} />
        </mesh>
      )}
    </group>
  )
}

function ProceduralHeritageModel({
  asset,
  selectedFeature,
  onSelectFeature,
}: {
  asset: HeritageAsset
  selectedFeature: HeritageFeature | undefined
  onSelectFeature: (feature: HeritageFeature) => void
}) {
  const featureMap = useMemo(
    () => (selectedFeature ? selectedFeature.id : undefined),
    [selectedFeature],
  )

  const wallSegments = [
    { position: [0, 1.8, -4.6], size: [7.8, 3.4, 0.7] },
    { position: [0, 1.8, 4.6], size: [7.8, 3.4, 0.7] },
    { position: [-4.5, 1.8, 0], size: [0.7, 3.4, 7.8] },
    { position: [4.5, 1.8, 0], size: [0.7, 3.4, 7.8] },
    { position: [-1.8, 1.6, 2.4], size: [2.5, 2.8, 0.5] },
    { position: [2.3, 1.6, -2.5], size: [2.8, 2.8, 0.5] },
  ]

  const stoneBlocks = [
    [-3.8, 0.35, -3.3],
    [-2.4, 0.35, -3.3],
    [-0.9, 0.35, -3.3],
    [0.8, 0.35, -3.3],
    [2.5, 0.35, -3.3],
    [3.9, 0.35, -3.3],
    [-3.8, 0.35, 3.5],
    [-2.4, 0.35, 3.5],
    [-0.9, 0.35, 3.5],
    [0.8, 0.35, 3.5],
    [2.5, 0.35, 3.5],
    [3.9, 0.35, 3.5],
    [-3.8, 0.35, 0],
    [-2.4, 0.35, 0],
    [-0.9, 0.35, 0],
    [0.8, 0.35, 0],
    [2.5, 0.35, 0],
    [3.9, 0.35, 0],
  ] as [number, number, number][]

  const terraceBlocks = [
    { position: [0, 0.9, 0], size: [8.5, 0.6, 8.5] },
    { position: [0, 1.5, 0], size: [6.8, 0.5, 6.2] },
    { position: [0, 2.2, 0], size: [5.2, 0.45, 5.1] },
  ]

  const steps = [
    { position: [0, 0.28, 5.7], size: [2.4, 0.22, 0.7] },
    { position: [0, 0.48, 6.3], size: [2.8, 0.22, 0.8] },
    { position: [0, 0.7, 6.9], size: [3.2, 0.2, 0.9] },
  ]

  return (
    <group>
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[6.1, 6.8, 0.42, 48]} />
        <meshStandardMaterial color="#c9b18f" roughness={1} />
      </mesh>

      {terraceBlocks.map((tier, index) => (
        <mesh key={`tier-${index}`} position={tier.position as [number, number, number]} receiveShadow castShadow>
          <boxGeometry args={tier.size as [number, number, number]} />
          <meshStandardMaterial color={index === 0 ? '#d4b98a' : index === 1 ? '#c7a978' : '#bb9574'} roughness={0.9} />
        </mesh>
      ))}

      {wallSegments.map((segment, index) => (
        <mesh key={`wall-${index}`} position={segment.position as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={segment.size as [number, number, number]} />
          <meshStandardMaterial color="#8d6c4f" roughness={0.9} />
        </mesh>
      ))}

      {stoneBlocks.map(([x, y, z], index) => (
        <mesh key={`stone-${index}`} position={[x, y, z]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.45, 0.55]} />
          <meshStandardMaterial color="#9a7657" roughness={0.96} />
        </mesh>
      ))}

      <mesh position={[-3.2, 1.9, 2.7]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 3.2, 1.1]} />
        <meshStandardMaterial color="#7d5840" roughness={0.9} />
      </mesh>
      <mesh position={[3.2, 1.8, -2.7]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 3.1, 1.1]} />
        <meshStandardMaterial color="#7d5840" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.3, -4.4]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 2.4, 0.9]} />
        <meshStandardMaterial color="#7d5840" roughness={0.88} />
      </mesh>

      {steps.map((step, index) => (
        <mesh key={`step-${index}`} position={step.position as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={step.size as [number, number, number]} />
          <meshStandardMaterial color="#c7ae8f" roughness={0.95} />
        </mesh>
      ))}

      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[6.4, 64]} />
        <meshStandardMaterial color="#cab592" roughness={1} />
      </mesh>

      {selectedFeature && (
        <mesh position={selectedFeature.anchor as [number, number, number]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#f2d18a" emissive="#f2d18a" emissiveIntensity={0.42} />
        </mesh>
      )}

      {asset.features.map((feature) => (
        <FeatureMarker
          key={feature.id}
          feature={feature}
          selected={featureMap === feature.id}
          onSelect={() => onSelectFeature(feature)}
        />
      ))}
    </group>
  )
}

export function HeritageViewer({ asset }: { asset: HeritageAsset }) {
  const controls = useRef<{ reset: () => void } | null>(null)
  const { viewMode } = usePlatform()
  const [selectedFeatureId, setSelectedFeatureId] = useState(asset.features[0]?.id ?? '')
  const [viewerState, setViewerState] = useState<'ready' | 'loading' | 'error'>('loading')

  const useEmbeddedModel = Boolean(asset.embedUrl)
  const selectedFeature = asset.features.find((feature) => feature.id === selectedFeatureId) ?? asset.features[0]
  const scenarioLabel =
    viewMode === 'degradation' ? 'Degradation scenario overlay' : viewMode === 'intervention' ? 'Conservation scenario overlay' : 'Current condition'

  return (
    <div className="heritage-viewer">
      <div className="heritage-header-row">
        <div>
          <div className="label">Heritage model</div>
          <h3 className="serif heritage-title">{asset.name}</h3>
        </div>
        <span className="badge">{asset.modelStatus}</span>
      </div>

      <div className="heritage-meta-grid">
        <div>
          <span className="label">Country</span>
          <p>{asset.country}</p>
        </div>
        <div>
          <span className="label">Format</span>
          <p>{asset.fileFormat}</p>
        </div>
        <div>
          <span className="label">Creator / source</span>
          <p>{asset.creator}</p>
        </div>
        <div>
          <span className="label">License</span>
          <p>{asset.license}</p>
        </div>
      </div>

      <div className={useEmbeddedModel ? 'twin-frame heritage-scene heritage-embed-frame' : 'twin-frame heritage-scene'}>
        {useEmbeddedModel ? (
          <>
            <div className={`heritage-embed-shell heritage-embed-shell--${viewMode}`}>
              <iframe
                className="heritage-embed"
                title={`${asset.name} 3D model`}
                src={asset.embedUrl}
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                style={{
                  filter:
                    viewMode === 'degradation'
                      ? 'sepia(0.42) saturate(1.25) brightness(0.94) hue-rotate(-12deg)'
                      : viewMode === 'intervention'
                        ? 'sepia(0.12) saturate(1.15) brightness(1.08) hue-rotate(16deg)'
                        : 'none',
                }}
              />
              <div className={`heritage-scenario-overlay heritage-scenario-overlay--${viewMode}`} aria-hidden="true" />
              <div className="heritage-scenario-badge">{scenarioLabel}</div>
            </div>
            <div className="legend heritage-legend">
              <div className="label">Attribution</div>
              <p>{asset.creator}</p>
              <p>{asset.license}</p>
            </div>
          </>
        ) : (
          <>
            <Canvas
              shadows
              camera={{ position: [9, 7, 9], fov: 38 }}
              onCreated={() => setViewerState('ready')}
            >
              <color attach="background" args={['#eadfc2']} />
              <ambientLight intensity={0.75} />
              <directionalLight position={[8, 15, 6]} intensity={1.2} castShadow />
              <ProceduralHeritageModel
                asset={asset}
                selectedFeature={selectedFeature}
                onSelectFeature={(feature) => setSelectedFeatureId(feature.id)}
              />
              <ContactShadows opacity={0.3} scale={18} blur={3} far={12} />
              <OrbitControls
                ref={controls as never}
                enablePan
                enableZoom
                minDistance={4}
                maxDistance={20}
                maxPolarAngle={Math.PI / 2.05}
              />
            </Canvas>

            <div className="legend heritage-legend">
              <div className="label">Feature map</div>
              {asset.features.map((feature) => (
                <button
                  key={feature.id}
                  type="button"
                  className={selectedFeatureId === feature.id ? 'feature-chip selected' : 'feature-chip'}
                  onClick={() => setSelectedFeatureId(feature.id)}
                >
                  {feature.name}
                </button>
              ))}
            </div>

            <div className="viewer-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={() => controls.current?.reset()}
              >
                Reset camera
              </button>
            </div>
          </>
        )}

        {!useEmbeddedModel && viewerState === 'loading' && (
          <div className="viewer-state">
            <div className="state-panel">Loading model…</div>
          </div>
        )}
      </div>

      <div className="heritage-info-row">
        <div className="card heritage-card">
          <div className="label">Context</div>
          <p>{asset.historicalContext}</p>
          <p>{asset.description}</p>
        </div>

        <div className="card heritage-card">
          <div className="label">Selected feature</div>
          {selectedFeature ? (
            <>
              <h4 className="feature-name">{selectedFeature.name}</h4>
              <p>{selectedFeature.description}</p>
              <p>
                <strong>Condition:</strong> {selectedFeature.condition}
              </p>
              <p>
                <strong>Confidence:</strong> {selectedFeature.confidence}
              </p>
              <p className="muted">{selectedFeature.source}</p>
            </>
          ) : (
            <p className="muted">No feature selected.</p>
          )}
        </div>
      </div>
    </div>
  )
}

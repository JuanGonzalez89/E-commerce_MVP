import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Html, MeshReflectorMaterial, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

const MODEL_SOURCES = [
  {
    path: '/models/macbook-option2.glb',
    label: 'BlenderKit Option 2',
    creditUrl: 'https://www.blenderkit.com/asset-gallery-detail/8a40e225-9f8a-48ac-aa9b-f240e0c3366e/',
    creditText: 'BK Free',
  },
  {
    path: '/models/macbook.glb',
    label: 'Poly Pizza fallback',
    creditUrl: 'https://poly.pizza/m/6eBS-C3E33W',
    creditText: 'CC BY 3.0',
  },
] as const;

function AnimatedModel({ model }: { model: THREE.Group }) {
  const rigRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rigRef.current) return;

    const t = state.clock.getElapsedTime();
    rigRef.current.position.y = Math.sin(t * 0.95) * 0.022;
    rigRef.current.rotation.z = Math.sin(t * 0.55) * 0.018;
  });

  return (
    <group ref={rigRef}>
      <primitive object={model} />
    </group>
  );
}

function FallbackMacbookModel() {
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: '#a9adb2',
    metalness: 0.85,
    roughness: 0.2,
  });

  const darkMaterial = new THREE.MeshStandardMaterial({
    color: '#22242a',
    metalness: 0.2,
    roughness: 0.6,
  });

  const screenMaterial = new THREE.MeshStandardMaterial({
    color: '#0c1118',
    metalness: 0,
    roughness: 1,
  });

  return (
    <group rotation={[-0.12, 0.68, 0]} scale={1.05}>
      <mesh position={[0, -0.18, 0]} material={bodyMaterial} castShadow receiveShadow>
        <boxGeometry args={[2.55, 0.08, 1.72]} />
      </mesh>

      <mesh position={[0, -0.12, 0]} material={darkMaterial} receiveShadow>
        <boxGeometry args={[2.22, 0.015, 1.42]} />
      </mesh>

      <group position={[0, 0.67, -0.68]} rotation={[1.15, 0, 0]}>
        <mesh material={bodyMaterial} castShadow receiveShadow>
          <boxGeometry args={[2.52, 1.56, 0.06]} />
        </mesh>
        <mesh position={[0, 0, 0.035]} material={screenMaterial}>
          <planeGeometry args={[2.26, 1.33]} />
        </mesh>
      </group>
    </group>
  );
}

export default function Macbook3D() {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;
    const loader = new GLTFLoader();

    const processScene = (gltf: { scene: THREE.Group }, sourceIndex: number) => {
        if (!isMounted) return;

        const scene = gltf.scene;
        const displayRotation = new THREE.Euler(-0.07, 0.62, 0);
        scene.rotation.copy(displayRotation);

        scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const applyScreenFinish = (material: THREE.Material) => {
            const standard = material as THREE.MeshStandardMaterial;
            if (standard && 'metalness' in standard && 'roughness' in standard) {
              standard.metalness = 0;
              standard.roughness = 1;
              standard.envMapIntensity = 0;
              standard.emissive = new THREE.Color(0x000000);
              standard.emissiveIntensity = 0;
              standard.needsUpdate = true;
            }
          };

          if (/display|screen|lcd|monitor/i.test(mesh.name)) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(applyScreenFinish);
            } else if (mesh.material) {
              applyScreenFinish(mesh.material);
            }
          }
        });

        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        if (maxDim > 0) {
          const targetSize = 2.45;
          const uniformScale = targetSize / maxDim;
          scene.scale.setScalar(uniformScale);
        }

        box.setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        scene.position.sub(center);

        box.setFromObject(scene);
        const floorY = -0.47;
        const desiredMinY = floorY + 0.012;
        scene.position.y += desiredMinY - box.min.y;

        setModel(scene);
        setModelStatus('ready');
    };

    const tryLoadModel = (index: number) => {
      if (index >= MODEL_SOURCES.length) {
        if (!isMounted) return;
        setModelStatus('error');
        return;
      }

      loader.load(
        MODEL_SOURCES[index].path,
        (gltf) => processScene(gltf, index),
        undefined,
        () => tryLoadModel(index + 1)
      );
    };

    tryLoadModel(0);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative h-[360px] sm:h-[430px] w-full rounded-3xl border border-border-dim bg-card/40 shadow-2xl overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_0%,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_65%)]" />
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.95, 4.3], fov: 30 }}
      >
        <color attach="background" args={['#08090c']} />
        <fog attach="fog" args={['#08090c', 5.4, 10]} />

        <hemisphereLight intensity={0.4} groundColor="#0c0f16" />
        <spotLight
          position={[4.5, 6, 5.5]}
          angle={0.4}
          penumbra={0.75}
          intensity={1.55}
          castShadow
        />
        <pointLight position={[-4, 2.2, -3]} intensity={0.75} color="#7fb2ff" />
        <pointLight position={[2.8, 1.4, 3.8]} intensity={0.65} color="#ffd2a8" />
        <Environment preset="studio" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <MeshReflectorMaterial
            blur={[450, 110]}
            resolution={1024}
            mixBlur={0.85}
            mixStrength={26}
            roughness={0.95}
            depthScale={0.8}
            minDepthThreshold={0.65}
            maxDepthThreshold={1.35}
            color="#111418"
            metalness={0.15}
          />
        </mesh>

        <ContactShadows
          position={[0, -0.47, 0]}
          opacity={0.62}
          scale={7}
          blur={2.6}
          far={4.4}
          resolution={1024}
          color="#000000"
        />

        {model ? (
          <AnimatedModel model={model} />
        ) : (
          <FallbackMacbookModel />
        )}

        {modelStatus === 'loading' && (
          <Html center>
            <div className="rounded-full border border-border-dim bg-bg/85 px-3 py-1 text-[10px] uppercase tracking-widest text-text-dim">
              Cargando modelo premium...
            </div>
          </Html>
        )}

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={2.15}
          maxDistance={4.3}
          minPolarAngle={Math.PI / 3.3}
          maxPolarAngle={Math.PI / 1.9}
          minAzimuthAngle={-Math.PI / 2.1}
          maxAzimuthAngle={Math.PI / 2.1}
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.58}
          autoRotate
          autoRotateSpeed={0.55}
        />

        <EffectComposer multisampling={4}>
          <Bloom intensity={0.5} luminanceThreshold={0.45} luminanceSmoothing={0.8} mipmapBlur />
          <Noise opacity={0.012} />
          <Vignette eskil={false} offset={0.15} darkness={0.95} />
        </EffectComposer>
      </Canvas>

      {modelStatus === 'error' && (
        <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-full border border-border-dim bg-bg/80 px-3 py-1 text-[10px] uppercase tracking-widest text-text-dim">
          Falta /public/models/macbook-option2.glb
        </div>
      )}

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border-dim bg-bg/65 px-3 py-1 text-[10px] uppercase tracking-widest text-text-dim">
        Arrastra para rotar y usa scroll para zoom
      </div>

    </div>
  );
}
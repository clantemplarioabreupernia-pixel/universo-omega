
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';

// Fix: Proper JSX namespace augmentation to resolve intrinsic element errors (group, mesh, etc.)
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

const NeuralCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const intensity = useStore((state) => state.intensity);
  const isGenerating = useStore((state) => state.isGenerating);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      meshRef.current.scale.setScalar(1 + pulse + (isGenerating ? 0.2 : 0));
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={isGenerating ? "#4f46e5" : "#0ea5e9"}
          speed={2}
          distort={0.4 + intensity * 0.2}
          radius={1}
        />
      </Sphere>
    </Float>
  );
};

const ConnectingLines = () => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 20; i++) {
      p.push(new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ));
    }
    return p;
  }, []);

  const lineRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={lineRef}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
};

const ThreeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <NeuralCore />
        <ConnectingLines />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;

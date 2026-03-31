"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 800;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 1.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const s = 0.5 + Math.random() * 0.5;
      colors[i * 3] = s * 0.788;
      colors[i * 3 + 1] = s * 0.663;
      colors[i * 3 + 2] = s * 0.431;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.1;
    meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.3;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function CoreOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!orbRef.current) return;
    const s = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    orbRef.current.scale.setScalar(s);
  });
  return (
    <mesh ref={orbRef}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial color="#c9a96e" emissive="#c9a96e" emissiveIntensity={0.8} transparent opacity={0.9} metalness={0.5} roughness={0.2} />
    </mesh>
  );
}

function Ring() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.getElapsedTime();
    ringRef.current.rotation.z = t * 0.5;
    ringRef.current.rotation.x = t * 0.3;
  });
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[0.8, 0.02, 16, 100]} />
      <meshStandardMaterial color="#e8c98a" emissive="#c9a96e" emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

export default function ParticleOrb3D() {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#c9a96e" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#e8c98a" />
        <Particles />
        <CoreOrb />
        <Ring />
      </Canvas>
    </div>
  );
}
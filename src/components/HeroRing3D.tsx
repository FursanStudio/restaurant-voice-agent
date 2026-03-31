"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GoldRings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (r1.current) { r1.current.rotation.x = t * 0.3; r1.current.rotation.y = t * 0.2; }
    if (r2.current) { r2.current.rotation.x = -t * 0.2; r2.current.rotation.z = t * 0.15; }
    if (r3.current) { r3.current.rotation.y = t * 0.25; r3.current.rotation.z = -t * 0.1; }
  });

  return (
    <group>
      <mesh ref={r1}>
        <torusGeometry args={[1.8, 0.06, 16, 100]} />
        <meshStandardMaterial color="#c9a96e" metalness={0.9} roughness={0.1} emissive="#7a6140" emissiveIntensity={0.4} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.4, 0.04, 16, 100]} />
        <meshStandardMaterial color="#e8c98a" metalness={0.8} roughness={0.2} emissive="#c9a96e" emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>
      <mesh ref={r3} rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <torusGeometry args={[3.0, 0.02, 16, 100]} />
        <meshStandardMaterial color="#7a6140" metalness={0.7} roughness={0.3} transparent opacity={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#c9a96e" emissive="#c9a96e" emissiveIntensity={1.5} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export default function HeroRing3D() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#c9a96e" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#e8c98a" />
        <GoldRings />
      </Canvas>
    </div>
  );
}
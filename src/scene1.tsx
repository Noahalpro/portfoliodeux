'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

const SpinningCube = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.03;
      meshRef.current.rotation.x += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[4, 2, 0]}>
      <boxGeometry args={[1.2,1.2,1.2]}/>
      <meshLambertMaterial color="rgb(209, 60, 255)" emissive="rgb(146, 30, 150)" />

    </mesh>
  );
};

const Scene1 = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none text-black">
      <Canvas camera={{ position: [0, 0, 5] }} 
      
  style={{ pointerEvents: 'none' }}>
        
        <color attach="background" args={['#ECECEC']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={10} />
        <SpinningCube />
        <OrbitControls enableZoom={false} enablePan={false} />

      </Canvas>
    </div>
  );
};

export default Scene1;

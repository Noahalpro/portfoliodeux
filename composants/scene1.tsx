'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState, useMemo, MutableRefObject } from 'react';
import { Group, Camera as ThreeCamera, AnimationClip, Vector3, Points, Mesh, Object3D } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Component for glowing particles around the flower
const FlowerParticles = ({ flowerPosition }: { flowerPosition: Vector3 }) => {
  const meshRef = useRef<Points>(null);
  const count = 100;
  const radius = 2;

  const positions = useMemo(() => {
    const positionsArray = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = (Math.random() * 2 - 1) * radius;
      const y = (Math.random() * 2 - 1) * radius;
      const z = (Math.random() * 2 - 1) * radius;

      const distance = Math.sqrt(x * x + y * y + z * z);
      if (distance > radius) {
        const normalizedFactor = radius / distance;
        positionsArray[i3] = x * normalizedFactor;
        positionsArray[i3 + 1] = y * normalizedFactor;
        positionsArray[i3 + 2] = z * normalizedFactor;
      } else {
        positionsArray[i3] = x;
        positionsArray[i3 + 1] = y;
        positionsArray[i3 + 2] = z;
      }
    }
    return positionsArray;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (meshRef.current && flowerPosition) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 3;
      meshRef.current.position.y = flowerPosition.y + Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <points ref={meshRef} position={flowerPosition}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color(0.831, 0.451, 0.831)}
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const PortfolioModel = ({ scrollProgress }: { scrollProgress: MutableRefObject<number> }) => {
  const { set, camera: currentCamera } = useThree();
  const { scene, animations } = useGLTF('/glt/animationfin3.gltf');
  const group = useRef<Group>(null);
  const { actions, mixer } = useAnimations(animations, group);

  const [flowerPosition, setFlowerPosition] = useState<Vector3>(new THREE.Vector3());
  const [isFlowerVisible, setIsFlowerVisible] = useState(false);
  const flowerMeshRef = useRef<Mesh | null>(null);

  useFrame(() => {
    if (!mixer) return;

    const totalDuration = animations.reduce((max, clip) => Math.max(max, clip.duration), 0);
    if (totalDuration === 0 || animations.length === 0) return;

    const newMixerTime = scrollProgress.current * totalDuration;
    mixer.setTime(newMixerTime);

    if (flowerMeshRef.current) {
      const { x, y, z } = flowerMeshRef.current.scale;
      const visible = x > 0 || y > 0 || z > 0;
      if (visible !== isFlowerVisible) {
        setIsFlowerVisible(visible);
      }
    }
  });

  useEffect(() => {
    scene.traverse((child: Object3D) => {
      if ((child as Mesh).isMesh) {
        (child as Mesh).castShadow = true;
        (child as Mesh).receiveShadow = true;
      }

      if (child.name === 'FLOWER') {
        setFlowerPosition(child.position.clone());
        flowerMeshRef.current = child as Mesh;
      }
    });

    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.reset().fadeIn(0.5).setLoop(THREE.LoopRepeat, Infinity).play();
          action.timeScale = 1;
        }
      });
    }

    let gltfCamera: ThreeCamera | null = null;
    let cameraAnimationFound = false;

    scene.traverse((obj: Object3D) => {
      if (obj instanceof ThreeCamera) {
        gltfCamera = obj;

        animations.forEach((clip: AnimationClip) => {
          const hasCameraTrack = clip.tracks.some((track) =>
            track.name.includes(obj.uuid) ||
            track.name.includes(obj.name) ||
            (obj.parent && (track.name.includes(obj.parent.uuid) || track.name.includes(obj.parent.name)))
          );

          if (hasCameraTrack) {
            const cameraAction = mixer.clipAction(clip, gltfCamera!);
            cameraAction.reset().fadeIn(0.5).setLoop(THREE.LoopRepeat, Infinity).play();
            cameraAction.timeScale = 1;
            cameraAnimationFound = true;
          }
        });
      }
    });

    if (gltfCamera) {
      set({ camera: gltfCamera });
    }

    if (typeof window !== 'undefined' && (ScrollTrigger as any).refresh) {
      (ScrollTrigger as any).refresh();
    }
  }, [actions, animations, scene, mixer, set]);

  return (
    <primitive ref={group} object={scene} dispose={null} position={[2, 0, 0]} scale={[1, 1, 1]}>
      {isFlowerVisible && <FlowerParticles flowerPosition={flowerPosition} />}
    </primitive>
  );
};

const Scene1 = () => {
  const scrollProgress = useRef<number>(0);
  const comp = useRef<gsap.Context | null>(null);

  useEffect(() => {
    comp.current = gsap.context(() => {
      ScrollTrigger.create({
        scroller: window,
        start: 'top top',
        end: '8300px',
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
        invalidateOnRefresh: true,
      });
    });

    return () => {
      if (comp.current) comp.current.revert();
    };
  }, []);

  return (
    <div>
      <div className="fixed top-0 left-0 w-screen h-screen -z-15 pointer-events-none">
        <Canvas
          camera={{ position: [0, 10, 20] }}
          style={{ pointerEvents: 'none' }}
          dpr={[1, 2]}
          shadows
        >
          <color attach="background" args={['yellow']} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 10, 5]} intensity={0.5} />

          <Suspense fallback={null}>
            <PortfolioModel scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Scene1;

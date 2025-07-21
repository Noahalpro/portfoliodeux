'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState, useMemo, MutableRefObject } from 'react';
import { Group, Camera as ThreeCamera, AnimationClip, Vector3, Points, Mesh, Object3D } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Script from 'next/script'; // Import Script from next/script for loading external JS

gsap.registerPlugin(ScrollTrigger);

// Declare global VANTA and THREE objects for TypeScript
// This tells TypeScript that these variables will exist on the window object at runtime.
declare global {
  interface Window {
    VANTA: any;
    THREE: any; // VANTA.js often relies on a global THREE object
  }
}

/**
 * VantaBackground Component
 * Renders the dynamic VANTA.NET background.
 * It loads the necessary Three.js and Vanta.js scripts and initializes the Vanta animation.
 */
const VantaBackground = () => {
  const vantaRef = useRef<HTMLDivElement>(null); // Ref to the DOM element where Vanta will render
  const [vantaInstance, setVantaInstance] = useState<any>(null); // State to hold the Vanta animation instance

  // useEffect hook to initialize and clean up the Vanta animation
  useEffect(() => {
    // This function attempts to initialize Vanta.NET
    const initializeVanta = () => {
      // Check if the DOM element exists and if VANTA.js and its NET effect are available globally
      if (vantaRef.current && window.VANTA && window.VANTA.NET) {
        // If Vanta is not already initialized for this component, create a new instance
        if (!vantaInstance) {
          const instance = window.VANTA.NET({
            el: vantaRef.current, // Target element for Vanta to render into
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xd4adc7, // Color of the network lines/points
            backgroundColor: 0x282828, // Background color of the Vanta animation
            points: 11.00,
            maxDistance: 21.00,
            spacing: 16.00
          });
          setVantaInstance(instance); // Store the instance in state for cleanup
        }
      }
    };

    // Cleanup function: Destroy the Vanta instance when the component unmounts
    return () => {
      if (vantaInstance) {
        vantaInstance.destroy(); // Properly dispose of the Vanta animation
      }
    };
  }, [vantaInstance]); // Dependency array: re-run if vantaInstance changes (should only happen once on init)

  return (
    <>
      {/* Load Three.js script (Vanta's dependency) */}
      {/* 'beforeInteractive' strategy ensures Three.js is available before React hydration */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          // You can add a console log here if you want to confirm Three.js loaded
          // console.log('Three.js loaded for Vanta');
        }}
      />
      {/* Load Vanta.NET script */}
      {/* 'lazyOnload' strategy loads the script after the page is interactive */}
      <Script
        src="https://cdn.jsdelivr.net/gh/tengbao/vanta@latest/dist/vanta.net.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Once Vanta.NET script is loaded, attempt to initialize Vanta
          // This ensures window.VANTA.NET is available
          if (vantaRef.current && window.VANTA && window.VANTA.NET) {
            if (!vantaInstance) { // Only initialize if not already initialized
              const instance = window.VANTA.NET({
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0xd4adc7,
                backgroundColor: 0x282828,
                points: 11.00,
                maxDistance: 21.00,
                spacing: 16.00
              });
              setVantaInstance(instance);
            }
          }
        }}
      />
      {/* This is the div where Vanta.NET will render its animation */}
      {/* It's positioned fixed, full screen, and with a lower z-index than the R3F Canvas */}
      <div
        ref={vantaRef}
        className="fixed top-0 left-0 w-screen h-screen -z-20 pointer-events-none"
      ></div>
    </>
  );
};


// Existing FlowerParticles Component
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

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  useFrame(({ clock }) => {
    if (meshRef.current && flowerPosition) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 3;
      meshRef.current.position.y = flowerPosition.y + Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <points ref={meshRef} position={flowerPosition}>
      <primitive object={geometry} attach="geometry" />
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

// Existing PortfolioModel Component
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

// Main Scene1 Component
const Scene1 = () => {
  const scrollProgress = useRef<number>(0);
  const comp = useRef<gsap.Context | null>(null);

  useEffect(() => {
    comp.current = gsap.context(() => {
      ScrollTrigger.create({
        scroller: window,
        start: 'top top',
        end: '8200px',
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
      {/* VANTA.NET Background component */}
      <VantaBackground />

      {/* Your existing @react-three/fiber Canvas */}
      {/* This will be rendered on top of the Vanta background due to z-index */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-15 pointer-events-none">
        <Canvas
          camera={{ position: [0, 10, 20] }}
          style={{ pointerEvents: 'none' }}
          dpr={[1, 2]}
          shadows
        >
          {/* The background color here will be for the R3F scene itself,
              which sits on top of the Vanta.NET background. */}
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

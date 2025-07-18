'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Group, Camera as ThreeCamera, AnimationClip, Vector3, Points, BufferGeometry, PointsMaterial, Mesh } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap'; // Import GSAP
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger

// Register GSAP ScrollTrigger plugin (do this once at application start)
gsap.registerPlugin(ScrollTrigger);


// Component for glowing particles around the flower
const FlowerParticles = ({ flowerPosition }) => {
  const meshRef = useRef<Points>(null);
  const count = 100; // Number of particles
  const radius = 2; // Dispersion radius around the flower

  // Generate particle positions once
  const positions = useMemo(() => {
    const positionsArray = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Random position in a sphere around the origin
      const x = (Math.random() * 2 - 1) * radius;
      const y = (Math.random() * 2 - 1) * radius;
      const z = (Math.random() * 2 - 1) * radius;

      // Ensure particles are within the sphere
      const distance = Math.sqrt(x * x + y * y + z * z);
      if (distance > radius) {
        // If outside the radius, bring them back inside
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

  // Animate particles (slight oscillation and rotation)
  useFrame(({ clock }) => {
    if (meshRef.current && flowerPosition) { // Check if flowerPosition is defined
      meshRef.current.rotation.y = clock.getElapsedTime() * 3; // Slow rotation
      meshRef.current.position.y = flowerPosition.y + Math.sin(clock.getElapsedTime() * 0.5) * 0.2; // Vertical oscillation
    }
  });

  return (
    <points ref={meshRef} position={flowerPosition}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        color={new THREE.Color(0.831, 0.451, 0.831)} // Luminous purple color
        size={0.12} // Particle size
        sizeAttenuation={true} // Further particles are smaller
        transparent={true}
        opacity={0.9}
        blending={THREE.AdditiveBlending} // For luminous effect
        depthWrite={false} // Important for additive blending
      />
    </points>
  );
};

// Component to load and display the GLTF model with animation
const PortfolioModel = ({ scrollProgress }) => { // Receives scrollProgress as prop
  const { set, camera: currentCamera } = useThree(); // Get current camera
  const { scene, animations } = useGLTF('/glt/animationfin3.gltf');
  const group = useRef<Group>(null);
  const { actions, mixer } = useAnimations(animations, group);

  const [flowerPosition, setFlowerPosition] = useState<Vector3>(new THREE.Vector3());
  const [isFlowerVisible, setIsFlowerVisible] = useState(false);
  const flowerMeshRef = useRef<Mesh | null>(null);

  // Use useFrame to update the mixer based on scrollProgress
  useFrame(() => {
    if (!mixer) {
      console.warn("Animation mixer not available.");
      return;
    }
    // Calculate total animation duration to map scroll 0-1 to animation duration
    const totalDuration = animations.reduce((max, clip) => Math.max(max, clip.duration), 0);

    // Log for total duration debugging
    if (totalDuration === 0 && animations.length > 0) {
      console.error("CRITICAL ERROR: Total animation duration is 0. Animation will not play. Check your GLTF file and its export from Blender.");
      animations.forEach((clip, index) => {
        console.error(`Clip ${index} (${clip.name}): Duration = ${clip.duration}`);
      });
      return; // Stop processing if duration is 0
    } else if (animations.length === 0) {
      console.warn("No animations found in GLTF model. Scrolling will have no effect on the animation.");
      return;
    }

    const newMixerTime = scrollProgress.current * totalDuration;
    mixer.setTime(newMixerTime);

    // Check flower scale on each frame for particle visibility
    if (flowerMeshRef.current) {
      const currentScale = flowerMeshRef.current.scale;
      const visible = currentScale.x > 0 || currentScale.y > 0 || currentScale.z > 0;
      if (visible !== isFlowerVisible) {
        setIsFlowerVisible(visible);
      }
    }
  });

  useEffect(() => {
    // Traverse the scene to enable shadows on all meshes
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      // Find the position of the "FLOWER" object and store its reference
      if (child.name === "FLOWER") {
        setFlowerPosition(child.position);
        flowerMeshRef.current = child as Mesh; // Store FLOWER mesh reference
      }
    });

    // Log all loaded animations and their duration
    console.log("Loaded animations:", animations);
    animations.forEach((clip, index) => {
      console.log(`Clip ${index} (${clip.name}): Duration = ${clip.duration.toFixed(2)}s`);
    });


    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach(action => {
        if (action) {
          action
            .reset()
            .fadeIn(0.5)
            .setLoop(THREE.LoopRepeat, Infinity) // Loop indefinitely
            .play(); // Animation starts
          action.timeScale = 1; // Normal speed is 1, but controlled by setTime
          console.log(`Initializing object/skeleton animation for scroll: ${action.getClip().name}, Paused: ${action.paused}, IsRunning: ${action.isRunning()}`);
        }
      });
    } else {
      console.log("[Animation Info] No object/skeleton animation actions detected or actions not ready.");
    }

    // *** GLTF CAMERA ANIMATION MANAGEMENT AND START ***
    let gltfCamera = null;
    let cameraAnimationFound = false;

    scene.traverse((obj) => {
      if (obj instanceof ThreeCamera) {
        gltfCamera = obj;

        animations.forEach((clip: AnimationClip) => {
          const hasCameraTrack = clip.tracks.some(track =>
            track.name.includes(gltfCamera.uuid) ||
            track.name.includes(gltfCamera.name) ||
            (gltfCamera.parent && (track.name.includes(gltfCamera.parent.uuid) || track.name.includes(gltfCamera.parent.name)))
          );

          if (hasCameraTrack) {
            const cameraAction = mixer.clipAction(clip, gltfCamera);
            cameraAction
              .reset()
              .fadeIn(0.5)
              .setLoop(THREE.LoopRepeat, Infinity) // Loop indefinitely
              .play();
            cameraAction.timeScale = 1;
            cameraAnimationFound = true;
            console.log(`Initializing camera animation for scroll: ${clip.name}, Paused: ${cameraAction.paused}, IsRunning: ${cameraAction.isRunning()}`);
          }
        });
      }
    });

    if (!cameraAnimationFound) {
      console.log("[Animation Info] No specific camera animation detected for GLTF camera.");
    }

    if (gltfCamera) {
      set({ camera: gltfCamera });
      console.log(`GLTF camera '${gltfCamera.name || "unnamed"}' set as scene camera.`);
    } else {
      console.log("No GLTF camera found. Using default Canvas camera.");
    }

    // Important: Refresh ScrollTrigger after the model and its elements are ready
    if (typeof window !== 'undefined' && window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
      console.log("ScrollTrigger.refresh() called after model loading.");
    }


  }, [actions, animations, scene, mixer, set]);

  return (
    <primitive ref={group} object={scene} dispose={null} position={[2, 0, 0]} scale={[1, 1, 1]} >
      {isFlowerVisible && <FlowerParticles flowerPosition={flowerPosition} />}
    </primitive>
  );
};

const Scene1 = () => {
  const scrollProgress = useRef(0); // Reference to store scroll progress
  const comp = useRef(null); // Reference for GSAP context

  useEffect(() => {
    // Create a GSAP context to manage animations and ScrollTriggers in isolation
    comp.current = gsap.context(() => {
      // Create a ScrollTrigger that controls animation progress
      ScrollTrigger.create({
        scroller: window, // Target window as scroller
        start: "top top", // Trigger when page top reaches window top
        end: "8300px", // Animation runs over 10000 pixels of scroll
        onUpdate: (self) => {
          scrollProgress.current = self.progress; // self.progress is between 0 and 1
        },
        invalidateOnRefresh: true, // Recalculate start/end on refresh (resize, etc.)
      });
      console.log("ScrollTrigger created targeting window with end at 10000px.");
    });

    // Cleanup ScrollTrigger on component unmount
    return () => {
      if (comp.current) {
        comp.current.revert(); // Kill all animations and ScrollTriggers in this context
        console.log("GSAP context and ScrollTriggers cleaned up.");
      }
    };
  }, []); // Empty dependencies to run only once

  return (
    // This div creates a scroll height for the entire page (10000px).
    <div> {/* Removed fixed height */}

      {/* This div contains the 3D Canvas and remains fixed over the scrolling content */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-15 pointer-events-none">
        <Canvas
          camera={{ position: [0, 10, 20] }}
          style={{ pointerEvents: 'none' }}
          dpr={[1, 2]}
          shadows
        >
          <color attach="background" args={['#ECECEC']} />

          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 10, 5]} intensity={0.5} />

          <Suspense fallback={null}>
            <PortfolioModel scrollProgress={scrollProgress} /> {/* Pass reference */}
          </Suspense>

          {/* OrbitControls is commented out to allow GLTF camera animation to take control. */}
          {/* If you want to manually control the camera AFTER GLTF animation,
              you will need to manage the transition or enable them conditionally. */}
          {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
        </Canvas>
      </div>
    </div>
  );
};

export default Scene1;

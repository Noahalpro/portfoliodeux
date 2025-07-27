'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState, useMemo, MutableRefObject } from 'react';
import { Group, Camera as ThreeCamera, AnimationClip, Vector3, Points, Mesh, Object3D } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Importez ScrollTrigger ici

// FIX: Renommé l'import de 'Script' en 'NextScript' pour éviter les conflits potentiels
import NextScript from 'next/script'; 

gsap.registerPlugin(ScrollTrigger);

// Déclare les objets globaux VANTA et THREE pour TypeScript
// Cela indique à TypeScript que ces variables existeront sur l'objet window à l'exécution.
declare global {
  interface Window {
    VANTA: any;
    THREE: any; // VANTA.js dépend souvent d'un objet THREE global
  }
}

/**
 * Composant VantaBackground
 * Rend le fond dynamique VANTA.NET.
 * Il charge les scripts Three.js et Vanta.js nécessaires et initialise l'animation Vanta.
 */
const VantaBackground = () => {
  const vantaRef = useRef<HTMLDivElement>(null); // Référence à l'élément DOM où Vanta sera rendu
  const [vantaInstance, setVantaInstance] = useState<any>(null); // État pour conserver l'instance de l'animation Vanta

  // Effet pour initialiser et nettoyer l'animation Vanta
  useEffect(() => {
    // Cette fonction tente d'initialiser Vanta.NET
    const initializeVanta = () => {
      // Vérifie si l'élément DOM existe et si VANTA.js et son effet NET sont disponibles globalement
      if (vantaRef.current && window.VANTA && window.VANTA.NET) {
        // Si Vanta n'est pas déjà initialisé pour ce composant, crée une nouvelle instance
        if (!vantaInstance) {
          const instance = window.VANTA.NET({
            el: vantaRef.current, // Élément cible pour le rendu de Vanta
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xd4adc7, // Couleur des lignes/points du réseau
            backgroundColor: 0x282828, // Couleur de fond de l'animation Vanta
            points: 11.00,
            maxDistance: 21.00,
            spacing: 16.00
          });
          setVantaInstance(instance); // Stocke l'instance dans l'état pour le nettoyage
        }
      }
    };

    // Fonction de nettoyage : Détruit l'instance Vanta lorsque le composant est démonté
    return () => {
      if (vantaInstance) {
        vantaInstance.destroy(); // Libère correctement l'animation Vanta
      }
    };
  }, [vantaInstance]); // Tableau de dépendances : réexécute si vantaInstance change (ne devrait se produire qu'une fois à l'initialisation)

  return (
    <>
      {/* Charge le script Three.js (dépendance de Vanta) */}
      {/* La stratégie 'beforeInteractive' garantit que Three.js est disponible avant l'hydratation de React */}
      <NextScript // FIX: Utilise 'NextScript' ici
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          // Vous pouvez ajouter un console log ici si vous voulez confirmer le chargement de Three.js
          // console.log('Three.js loaded for Vanta');
        }}
      />
      {/* Charge le script Vanta.NET */}
      {/* La stratégie 'lazyOnload' charge le script après que la page soit interactive */}
      <NextScript // FIX: Utilise 'NextScript' ici
        src="https://cdn.jsdelivr.net/gh/tengbao/vanta@latest/dist/vanta.net.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Une fois le script Vanta.NET chargé, tente d'initialiser Vanta
          // Cela garantit que window.VANTA.NET est disponible
          if (vantaRef.current && window.VANTA && window.VANTA.NET) {
            if (!vantaInstance) { // Initialise uniquement si pas déjà initialisé
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
      {/* C'est la div où Vanta.NET rendra son animation */}
      {/* Elle est positionnée en fixe, plein écran, et avec un z-index inférieur au Canvas R3F */}
      <div
        ref={vantaRef}
        className="fixed top-0 left-0 w-screen h-screen -z-20 pointer-events-none"
      ></div>
    </>
  );
};


// Composant FlowerParticles existant
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

// Composant PortfolioModel existant
const PortfolioModel = ({ scrollProgress }: { scrollProgress: MutableRefObject<number> }) => {
  // Obtenez le viewport pour le scaling responsive et la caméra
  const { set, camera: currentCamera, viewport } = useThree();
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
    // La variable gltfCamera est maintenant utilisée uniquement dans le scope où son type est certain.
    let foundGltfCamera: THREE.PerspectiveCamera | null = null;
    let cameraAnimationFound = false; // Cette variable n'est pas utilisée après son assignation, peut être retirée si non utile.

    scene.traverse((obj: Object3D) => {
      if ((obj as Mesh).isMesh) {
        (obj as Mesh).castShadow = true;
        (obj as Mesh).receiveShadow = true;
      }

      if (obj.name === 'FLOWER') {
        setFlowerPosition(obj.position.clone());
        flowerMeshRef.current = obj as Mesh;
      }

      // Cherche la caméra dans le GLTF et s'assure de son type
      if (obj instanceof THREE.PerspectiveCamera) {
        foundGltfCamera = obj; // Assignation à la variable typée localement
        
        // Mettre à jour le rapport d'aspect de la caméra GLTF
        // et sa matrice de projection immédiatement après l'avoir trouvée et typée.
        foundGltfCamera.aspect = viewport.aspect; // Accès direct aux propriétés
        foundGltfCamera.updateProjectionMatrix(); // Appel direct de la méthode
        console.log('GLTF Camera Aspect Updated:', foundGltfCamera.aspect);
        
        // Définir la caméra pour R3F immédiatement
        set({ camera: foundGltfCamera });

        // La logique d'animation de la caméra existante
        animations.forEach((clip: AnimationClip) => {
          const hasCameraTrack = clip.tracks.some((track) =>
            track.name.includes(obj.uuid) ||
            track.name.includes(obj.name) ||
            (obj.parent && (track.name.includes(obj.parent.uuid) || track.name.includes(obj.parent.name)))
          );

          if (hasCameraTrack) {
            const cameraAction = mixer.clipAction(clip, foundGltfCamera!);
            cameraAction.reset().fadeIn(0.5).setLoop(THREE.LoopRepeat, Infinity).play();
            cameraAction.timeScale = 1;
            cameraAnimationFound = true; // Cette variable n'est pas utilisée, peut être retirée.
          }
        });
      }
    });

    // Si aucune caméra GLTF n'a été trouvée et définie, la caméra par défaut de R3F sera utilisée.
    if (!foundGltfCamera) {
      console.warn('No PerspectiveCamera found in GLTF scene. Using default R3F camera.');
    }

    // Initialisation des animations du modèle
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.reset().fadeIn(0.5).setLoop(THREE.LoopRepeat, Infinity).play();
          action.timeScale = 1;
        }
      });
    }

    // Correction TypeScript pour ScrollTrigger.refresh()
    // Utilisation directe de la variable ScrollTrigger importée
    if (typeof window !== 'undefined' && ScrollTrigger.refresh) { // FIX: Utilise directement ScrollTrigger
      ScrollTrigger.refresh();
    }
  }, [actions, animations, scene, mixer, set, viewport.aspect]); // Dépend de viewport.aspect

  // Calculez un facteur d'échelle dynamique basé sur la plus petite dimension du viewport.
  // Cela aide à maintenir une "taille perçue" plus constante et à éviter l'étirement.
  // Ajustez le diviseur (par exemple, 4 ou 5) pour contrôler la taille générale du modèle.
  const responsiveScale = Math.min(viewport.width, viewport.height) / 4; // Ajustez ce facteur pour la taille désirée

  return (
    <primitive
      ref={group}
      object={scene}
      dispose={null}
      position={[0, 0, 0]} // Positionnez le modèle au centre pour commencer
      scale={[responsiveScale, responsiveScale, responsiveScale]} // Appliquez l'échelle calculée ici
    >
      {isFlowerVisible && <FlowerParticles flowerPosition={flowerPosition} />}
    </primitive>
  );
};

// Composant principal Scene1
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
      {/* Composant de fond VANTA.NET */}
      <VantaBackground />

      {/* Votre Canvas @react-three/fiber existant */}
      {/* Ceci sera rendu par-dessus le fond Vanta en raison du z-index */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-15 pointer-events-none">
        <Canvas
          camera={{ position: [0, 10, 20] }} // Cette caméra par défaut sera remplacée par la caméra GLTF
          style={{ pointerEvents: 'none' }}
          dpr={[1, 2]}
          shadows
        >
          {/* La couleur de fond ici sera pour la scène R3F elle-même,
              qui se trouve au-dessus du fond Vanta.NET. */}
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

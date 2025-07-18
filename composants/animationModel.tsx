// src/components/GLTFModel.js
import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'; // Importez Three.js pour les constantes comme LoopOnce

export default function GLTFModel() {
  // Référence au groupe d'objets du modèle GLTF
  const group = useRef();

  // Charge le modèle GLTF et ses animations
  // REMPLACEZ '/models/animation_model.gltf' PAR LE CHEMIN RÉEL DE VOTRE MODÈLE
  const { scene, animations } = useGLTF('../public/animPortofolio.gltf');

  // Hook pour gérer les animations du modèle
  const { actions, mixer } = useAnimations(animations, group);

  // Hook de Drei pour obtenir la progression du défilement
  const scroll = useScroll();

  // Effet pour initialiser l'animation une fois le composant monté
  useEffect(() => {
    // Assurez-vous qu'il y a des animations et récupérez la première
    const animationNames = Object.keys(actions);
    if (animationNames.length > 0) {
      const firstAnimationName = animationNames[0];
      const action = actions[firstAnimationName];

      if (action) {
        // Lance l'animation, mais la met en pause immédiatement
        // pour que le défilement puisse la contrôler.
        action.play();
        action.paused = true;

        // Configure l'animation pour qu'elle ne se répète qu'une fois
        // et reste à sa dernière image une fois terminée.
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
      }
    }
  }, [actions]); // Déclenche cet effet lorsque les actions d'animation sont disponibles

  // Hook useFrame est appelé à chaque frame de rendu de Three.js
  useFrame(() => {
    // Si des actions d'animation et un mixer existent
    if (actions && mixer) {
      const animationNames = Object.keys(actions);
      if (animationNames.length > 0) {
        const firstAnimationName = animationNames[0];
        const action = actions[firstAnimationName];

        if (action) {
          // 'scroll.offset' est une valeur de 0 à 1 représentant la progression du défilement.
          // Nous mappons cette progression à la durée de l'animation.
          // Cela permet de contrôler l'animation avec le défilement.
          action.time = action.getClip().duration * scroll.offset;
        }
      }
    }
  });

  // Retourne le modèle 3D. 'dispose={null}' empêche Three.js de disposer de la géométrie
  // et des matériaux du modèle lors du démontage du composant, ce qui est utile
  // si vous voulez réutiliser le modèle ou éviter des avertissements.
  return (
    <primitive object={scene} ref={group} dispose={null} />
  );
}

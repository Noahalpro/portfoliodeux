'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { Group } from 'three';

type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

export default function GLTFModel() {
  const group = useRef<Group>(null);

  const { scene, animations }: GLTFResult = useGLTF('/animPortofolio.gltf');
  const { actions, mixer } = useAnimations(animations, group);
  const scroll = useScroll();

  useEffect(() => {
    if (!actions) return;

    const animationNames = Object.keys(actions);
    if (animationNames.length > 0) {
      const firstAnimationName = animationNames[0];
      const action = actions[firstAnimationName];

      if (action) {
        action.play();
        action.paused = true;
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      }
    }
  }, [actions]);

  useFrame(() => {
    if (!actions || !mixer) return;

    const animationNames = Object.keys(actions);
    if (animationNames.length > 0) {
      const firstAnimationName = animationNames[0];
      const action = actions[firstAnimationName];

      if (action) {
        action.time = action.getClip().duration * scroll.offset;
      }
    }
  });

  return (
    <primitive object={scene} ref={group} dispose={null} />
  );
}

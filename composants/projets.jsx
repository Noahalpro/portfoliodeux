// components/Projets.jsx
"use client"; // Indique que ce composant est un client component dans Next.js

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

// Données des projets (vous pouvez les remplacer par vos propres projets)
const projectData = [
  {
    id: 1,
    title: 'Site E-commerce Innovant',
    description: 'Développement d\'une plateforme e-commerce moderne avec des fonctionnalités avancées et une expérience utilisateur fluide.',
    image: 'https://placehold.co/300x200/3a3a3a/888888?text=E-commerce', // Image de placeholder
    link: '/projets/ecommerce',
  },
  {
    id: 2,
    title: 'Application de Gestion de Tâches',
    description: 'Création d\'une application web intuitive pour organiser et suivre vos tâches quotidiennes avec des rappels personnalisés.',
    image: 'https://placehold.co/300x200/3a3a3a/888888?text=Gestion+Tâches',
    link: '/projets/gestion-taches',
  },
  {
    id: 3,
    title: 'Portfolio 3D Interactif',
    description: 'Conception d\'un portfolio artistique avec des éléments 3D interactifs pour une présentation immersive de mes œuvres.',
    image: 'https://placehold.co/300x200/3a3a3a/888888?text=Portfolio+3D',
    link: '/projets/portfolio-3d',
  },
];

// Chemins SVG de base pour les gribouillis (variés et plus robustes)
const baseScribblePaths = [
  // Forme rectangulaire avec des coins légèrement arrondis et plus simple
  "M 20 10 Q 10 10 10 20 L 10 60 Q 10 70 20 70 L 230 70 Q 240 70 240 60 L 240 20 Q 240 10 230 10 Z",
  // Forme ovale/circulaire plus régulière
  "M 125 10 C 185 10, 240 30, 240 40 C 240 50, 185 70, 125 70 C 65 70, 10 50, 10 40 C 10 30, 65 10, 125 10 Z",
  // Forme zigzag prononcée et équilibrée
  "M 10 40 L 50 10 L 90 40 L 130 10 L 170 40 L 210 10 L 240 40",
  // Forme ondulée douce et symétrique
  "M 10 40 C 40 20, 70 60, 100 40 C 130 20, 160 60, 190 40 C 220 20, 240 60, 240 40",
  // Forme libre et asymétrique (simplifiée pour robustesse)
  "M 30 20 C 60 5, 90 50, 120 30 S 180 70, 210 50 C 220 40, 230 15, 200 10 L 180 65 L 60 70 L 20 45 Z",
  // Bulle de parole stylisée (ajustée pour être plus stable)
  "M 20 30 C 20 10, 50 5, 80 10 C 110 15, 140 5, 170 10 C 200 15, 230 10, 230 30 C 230 50, 200 65, 170 60 C 140 55, 110 65, 80 60 C 50 55, 20 65, 20 45 L 10 50 L 20 30 Z",
  // Gribouillis plus dynamique (simplifié)
  "M 10 20 C 30 5, 60 40, 90 20 S 150 60, 180 40 C 200 25, 230 50, 240 30 C 245 40, 230 60, 200 65 C 170 70, 140 55, 110 60 C 80 65, 50 50, 20 55 Z"
];

/**
 * Génère un chemin SVG de gribouillis aléatoire basé sur un chemin de base.
 * Ajoute un décalage aléatoire à chaque point du chemin de base.
 * @param {string} basePath Le chemin SVG (attribut 'd') à randomiser.
 * @param {number} maxOffset L'offset maximal pour la randomisation des points.
 * @returns {string} Le nouveau chemin SVG randomisé.
 */
const generateRandomScribblePath = (basePath, maxOffset = 8) => {
  // Regex pour trouver les commandes SVG (M, C, L, S, Q, A, Z) et leurs coordonnées
  const commands = basePath.match(/[MCLSQAZ][^MCLSQAZ]*/g);
  let newPath = '';

  commands.forEach(cmdStr => {
    const command = cmdStr[0]; // Ex: 'M', 'C', 'L', 'Q', 'A', 'S', 'Z'
    const coordsStr = cmdStr.substring(1).trim(); // Ex: '10 10', '30 5, 70 15, 90 10'
    // Diviser par espace ou virgule, filtrer les chaînes vides, et convertir en nombres
    const coords = coordsStr.split(/[\s,]+/).filter(Boolean).map(Number);

    let newCoords = [];
    // Gérer les commandes 'Z' (fermeture de chemin) qui n'ont pas de coordonnées
    if (command === 'Z') {
      newPath += command;
      return;
    }
    // Gérer les commandes 'A' (arc) qui ont plus de coordonnées par segment
    if (command === 'A') {
      // Pour les arcs, les 5 premiers paramètres (rx, ry, xAxisRotation, largeArcFlag, sweepFlag) ne sont pas des coordonnées
      // Seuls les deux derniers (x, y) sont des coordonnées qui peuvent être randomisées.
      // Nous allons simplifier en ne randomisant que les points finaux pour éviter des arcs invalides.
      // Si vous avez besoin d'une randomisation plus complexe des arcs, cela nécessiterait une logique plus avancée.
      newCoords = [...coords]; // Copie les coordonnées existantes
      if (newCoords.length >= 2) { // Assurez-vous qu'il y a au moins un point final (x, y)
        const x = newCoords[newCoords.length - 2];
        const y = newCoords[newCoords.length - 1];
        const offsetX = (Math.random() - 0.5) * maxOffset * 2;
        const offsetY = (Math.random() - 0.5) * maxOffset * 2;
        newCoords[newCoords.length - 2] = x + offsetX;
        newCoords[newCoords.length - 1] = y + offsetY;
      }
    } else {
      for (let i = 0; i < coords.length; i += 2) {
        const x = coords[i];
        const y = coords[i + 1];
        // Générer un décalage aléatoire entre -maxOffset et +maxOffset
        const offsetX = (Math.random() - 0.5) * maxOffset * 2;
        const offsetY = (Math.random() - 0.5) * maxOffset * 2;
        newCoords.push(x + offsetX, y + offsetY);
      }
    }
    // Reconstruire la commande avec les nouvelles coordonnées
    newPath += `${command} ${newCoords.join(' ')}`;
  });
  return newPath;
};


const Projets = () => {
  // Référence pour chaque carte afin d'appliquer les animations GSAP individuellement
  const cardRefs = useRef([]);
  // Référence pour chaque chemin SVG de gribouillis
  const scribbleRefs = useRef([]);
  // État pour stocker les chemins de gribouillis aléatoires générés pour chaque carte
  const [randomScribblePaths, setRandomScribblePaths] = useState([]);

  // Générer les chemins aléatoires une seule fois au montage du composant
  useEffect(() => {
    const paths = projectData.map(() => {
      // Choisir un chemin de base aléatoire parmi les chemins définis
      const randomBasePath = baseScribblePaths[Math.floor(Math.random() * baseScribblePaths.length)];
      return generateRandomScribblePath(randomBasePath, 8); // '8' est l'offset max
    });
    setRandomScribblePaths(paths);
  }, []); // Le tableau de dépendances vide assure que cela ne s'exécute qu'une fois

  // Utilisation du hook useGSAP pour gérer les animations
  useGSAP(() => {
    cardRefs.current.forEach((card, index) => {
      // S'assurer que la carte existe avant d'appliquer les animations
      if (card) {
        // Définir l'origine de la transformation au centre de la carte
        gsap.set(card, { transformOrigin: "center center" });

        // Créer l'animation de secousse, initialement en pause
        const shakeTween = gsap.to(card, {
          x: 'random(-4, 4)', // Mouvement aléatoire sur l'axe X
          y: 'random(-4, 4)', // Mouvement aléatoire sur l'axe Y
          rotation: 'random(-1.5, 1.5)', // Légère rotation aléatoire
          duration: 0.1, // Durée courte pour un effet de secousse rapide
          repeat: -1, // Répète indéfiniment
          yoyo: true, // Va et vient
          paused: true, // Commence en pause
          ease: 'power1.inOut', // Easing pour un mouvement fluide
        });

        // Animation du gribouillis SVG
        const scribblePath = scribbleRefs.current[index];
        let scribbleTween;

        if (scribblePath) {
          const length = scribblePath.getTotalLength(); // Obtenir la longueur totale du tracé SVG

          // Définir l'état initial du tracé (invisible)
          gsap.set(scribblePath, {
            strokeDasharray: length,
            strokeDashoffset: length,
            stroke: '#8B5CF6', // Couleur violette pour le tracé (Tailwind's purple-500)
            strokeWidth: 3, // Épaisseur du tracé pour un effet de gribouillis plus visible
            fill: 'none', // Pas de remplissage
          });

          // Créer l'animation de dessin du gribouillis, initialement en pause
          scribbleTween = gsap.to(scribblePath, {
            strokeDashoffset: 0,
            duration: 0.8, // Durée de l'animation de dessin
            ease: 'power1.inOut',
            paused: true, // Commence en pause
          });
        }

        // Événement au survol de la souris (mouseenter)
        card.addEventListener('mouseenter', () => {
          // Agrandir légèrement la carte et démarrer l'animation de secousse
          gsap.to(card, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
          shakeTween.play();
          if (scribbleTween) {
            scribbleTween.play(); // Démarrer l'animation de gribouillis
          }
        });

        // Événement au départ de la souris (mouseleave)
        card.addEventListener('mouseleave', () => {
          // Réinitialiser la taille de la carte
          gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
          // Mettre en pause et réinitialiser l'animation de secousse
          shakeTween.pause(0).seek(0);
          gsap.to(card, { x: 0, y: 0, rotation: 0, duration: 0.2, ease: 'power1.out' });
          if (scribbleTween) {
            scribbleTween.reverse(); // Inverser l'animation de gribouillis
          }
        });
      }
    });
  }, { scope: cardRefs, dependencies: [randomScribblePaths] }); // Ajout de randomScribblePaths aux dépendances pour s'assurer que les animations sont correctement configurées avec les nouveaux chemins

  return (
    <section id="projets" className="bg-[#1a1a1a] text-[#e0e0e0] py-20 px-4 font-inter overflow-hidden">
      <div className="max-w-6xl mx-auto text-center px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-[#f0f0f0] mb-16 tracking-[-0.02em]">Mes Projets Récents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center items-stretch">
          {projectData.map((project, index) => (
            <div
              key={project.id}
              ref={el => cardRefs.current[index] = el}
              className="relative bg-[#282828] rounded-xl p-8 shadow-lg border border-[#333] flex flex-col items-center text-center transition-transform duration-300 ease-out cursor-pointer will-change-transform"
            >
              <img src={project.image} alt={project.title} className="w-full h-48 bg-[#3a3a3a] rounded-lg mb-6 flex justify-center items-center text-xl text-[#888] object-cover border border-[#444] relative z-10" />
              {/* Conteneur pour le titre et le gribouillis */}
              <div className="relative w-full flex justify-center items-center mb-4">
                <h3 className="text-3xl font-semibold text-[#f0f0f0] relative z-20">
                  {project.title}
                </h3>
                {/* SVG pour le gribouillis autour du titre */}
                <svg className="absolute w-[120%] h-[150%] max-w-[300px] max-h-[80px] z-10 pointer-events-none" viewBox="0 0 250 80" fill="none" xmlns="http://www.w3.org/2000/svg"
                     style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <path
                    ref={el => scribbleRefs.current[index] = el}
                    d={randomScribblePaths[index] || baseScribblePaths[0]} // Utilise le chemin aléatoire généré
                  />
                </svg>
              </div>
              <p className="text-lg leading-relaxed text-[#b0b0b0] mb-6 flex-grow relative z-10">{project.description}</p>
              <Link href={project.link} passHref 
                  className="inline-block bg-[#4a4a4a] text-[#f0f0f0] py-3 px-6 rounded-lg text-base font-semibold transition-colors duration-300 ease-out border-none cursor-pointer relative z-10 hover:bg-[#6a6a6a] hover:translate-y-[-2px]"
                >
                  Voir le projet

              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projets;

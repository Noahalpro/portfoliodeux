"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

// ✅ Données avec image locale en string
const projectData = [
  {
    id: 1,
    title: 'Site E-commerce Front-end',
    description: 'Développement du front-end d’une plateforme e-commerce moderne avec React, Next.js et Tailwind CSS, offrant une interface fluide et intuitive.',
    image: '/ImageTamp.png', // ✅ image dans /public
    link: 'https://tampp.vercel.app/',
  },
  {
    id: 2,
    title: 'Mon Vieux Grimmoire',
    description: 'Développement du back-end d\'une application web intuitive pour mettre en ligne, noter et voir des livres ainsi que leur note.',
    image: '/monvieuxgrimmoir.png',
    link: 'https://mon-projet-backend-lyi9bkyof-noahalpros-projects.vercel.app/',
  },
];

const baseScribblePaths = [
  "M 20 10 Q 10 10 10 20 L 10 60 Q 10 70 20 70 L 230 70 Q 240 70 240 60 L 240 20 Q 240 10 230 10 Z",
  "M 125 10 C 185 10, 240 30, 240 40 C 240 50, 185 70, 125 70 C 65 70, 10 50, 10 40 C 10 30, 65 10, 125 10 Z",
  "M 10 40 L 50 10 L 90 40 L 130 10 L 170 40 L 210 10 L 240 40",
  "M 10 40 C 40 20, 70 60, 100 40 C 130 20, 160 60, 190 40 C 220 20, 240 60, 240 40",
  "M 30 20 C 60 5, 90 50, 120 30 S 180 70, 210 50 C 220 40, 230 15, 200 10 L 180 65 L 60 70 L 20 45 Z",
  "M 20 30 C 20 10, 50 5, 80 10 C 110 15, 140 5, 170 10 C 200 15, 230 10, 230 30 C 230 50, 200 65, 170 60 C 140 55, 110 65, 80 60 C 50 55, 20 65, 20 45 L 10 50 L 20 30 Z",
  "M 10 20 C 30 5, 60 40, 90 20 S 150 60, 180 40 C 200 25, 230 50, 240 30 C 245 40, 230 60, 200 65 C 170 70, 140 55, 110 60 C 80 65, 50 50, 20 55 Z"
];

const generateRandomScribblePath = (basePath, maxOffset = 8) => {
  const commands = basePath.match(/[MCLSQAZ][^MCLSQAZ]*/g);
  let newPath = '';
  commands.forEach(cmdStr => {
    const command = cmdStr[0];
    const coordsStr = cmdStr.substring(1).trim();
    const coords = coordsStr.split(/[\s,]+/).filter(Boolean).map(Number);
    let newCoords = [];
    if (command === 'Z') {
      newPath += command;
      return;
    }
    if (command === 'A') {
      newCoords = [...coords];
      if (newCoords.length >= 2) {
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
        const offsetX = (Math.random() - 0.5) * maxOffset * 2;
        const offsetY = (Math.random() - 0.5) * maxOffset * 2;
        newCoords.push(x + offsetX, y + offsetY);
      }
    }
    newPath += `${command} ${newCoords.join(' ')}`;
  });
  return newPath;
};

const Projets = () => {
  const cardRefs = useRef([]);
  const scribbleRefs = useRef([]);
  const [randomScribblePaths, setRandomScribblePaths] = useState([]);

  useEffect(() => {
    const paths = projectData.map(() => {
      const randomBasePath = baseScribblePaths[Math.floor(Math.random() * baseScribblePaths.length)];
      return generateRandomScribblePath(randomBasePath, 8);
    });
    setRandomScribblePaths(paths);
  }, []);

  useGSAP(() => {
    cardRefs.current.forEach((card, index) => {
      if (card) {
        gsap.set(card, { transformOrigin: "center center" });
        const shakeTween = gsap.to(card, {
          x: 'random(-4, 4)',
          y: 'random(-4, 4)',
          rotation: 'random(-1.5, 1.5)',
          duration: 0.1,
          repeat: -1,
          yoyo: true,
          paused: true,
          ease: 'power1.inOut',
        });

        const scribblePath = scribbleRefs.current[index];
        let scribbleTween;
        if (scribblePath) {
          const length = scribblePath.getTotalLength();
          gsap.set(scribblePath, {
            strokeDasharray: length,
            strokeDashoffset: length,
            stroke: '#8B5CF6',
            strokeWidth: 3,
            fill: 'none',
          });
          scribbleTween = gsap.to(scribblePath, {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: 'power1.inOut',
            paused: true,
          });
        }

        card.addEventListener('mouseenter', () => {
          gsap.to(card, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
          shakeTween.play();
          if (scribbleTween) scribbleTween.play();
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
          shakeTween.pause(0).seek(0);
          gsap.to(card, { x: 0, y: 0, rotation: 0, duration: 0.2, ease: 'power1.out' });
          if (scribbleTween) scribbleTween.reverse();
        });
      }
    });
  }, { scope: cardRefs, dependencies: [randomScribblePaths] });

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
              {/* ✅ Image standard en <img /> */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 bg-[#3a3a3a] rounded-lg mb-6 object-cover border border-[#444] relative z-10"
              />
              <div className="relative w-full flex justify-center items-center mb-4">
                <h3 className="text-3xl font-semibold text-[#f0f0f0] relative z-20">
                  {project.title}
                </h3>
                <svg className="absolute w-[120%] h-[150%] max-w-[300px] max-h-[80px] z-10 pointer-events-none" viewBox="0 0 250 80" fill="none">
                  <path
                    ref={el => scribbleRefs.current[index] = el}
                    d={randomScribblePaths[index] || baseScribblePaths[0]}
                  />
                </svg>
              </div>
              <p className="text-lg leading-relaxed text-[#b0b0b0] mb-6 flex-grow relative z-10">{project.description}</p>
              <Link href={project.link} passHref>
                <span className="inline-block bg-[#4a4a4a] text-[#f0f0f0] py-3 px-6 rounded-lg text-base font-semibold transition-colors duration-300 ease-out border-none cursor-pointer relative z-10 hover:bg-[#6a6a6a] hover:translate-y-[-2px]">
                  Voir le projet
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projets;

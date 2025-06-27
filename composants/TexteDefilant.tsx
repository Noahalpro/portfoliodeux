'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PlusieursTextes() {
  useEffect(() => {
    gsap.utils.toArray('.texte-anim').forEach((p) => {
      gsap.from(p as HTMLElement, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: p as HTMLElement,
          start: 'top 80%',
          toggleActions: 'play reverse play reverse',
        },
      });
    });
  }, []);

  return (
    <section className='text-xl text-left mx-auto'>
      <div>
      
        <p className='texte-anim pt-[300px] pb-[500px]'>Que serait la technologie, sans mise en valeur ?</p>
      </div>
  
      <div>
        <p className='texte-anim pt-[100px] pb-[300px]'>Une coquille qui répond à des besoin tout en étant éfficace c’est vrai</p>
      </div>

      <div> 
        <p className='texte-anim pt-[100px] pb-[300px]'>
          mais cette coquille aurait un problème…

        </p>
      </div>

      <div>
        <p className='texte-anim pt-[100px] pb-[300px]'>
          Elle serait complètement
        </p>
        <p>
          vide
        </p>
        <p>
          dénué de sens
        </p>
        <p>
          et par dessus tout
        </p>
        <p>
          invisible
        </p>
        <p>
          parmis les autres technologies...
        </p>
      </div>

      <div>
        <p>
          mais si on y rajoutait une dimension artistique/ spéciale qui de plus mettrai en avant l’efficacité du projet ?
        </p>
      </div>
      
      <div>
        <p>
          Ce serait une coquille qui montre aux autres qu’elle est au dessus de la masse sans le justifier car elle incarnerait l’innovation par son harmonie !
        </p>
      </div>
      <div>
        <p>
          Notre approche ? Créer des projets qui excellent par leur efficacité, leur qualité, leur innovation et leur harmonie.
        </p>
      </div>
      <div>
        <p>
          
          Si vous souhaitez construire un outil technologique qui sera prêt à l'emploi, d'une efficacité redoutable, scalable et tout autant innovant en marquant les esprits par sa forme.
        </p>
      </div>
      <div>
        <p>
      Alors bienvenue. 
        </p>
        <button>Un projet ? Une collaboration ? Une question ?</button>
      </div>
      </section>
    
  );
}

'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PlusieursTextes() {
  useEffect(() => {
    // Ensure all ScrollTrigger instances are refreshed when the component mounts
    ScrollTrigger.refresh();

    gsap.utils.toArray('.texte-anim').forEach((p) => {
      gsap.from(p as HTMLElement, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: p as HTMLElement,
          start: 'top 90%',
          toggleActions: 'play reverse play reverse',
        },
      });
    });

    // Cleanup function for ScrollTrigger instances
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className='text-2xl text-left mx-auto text-white font-medium px-4'>
      <div className='  bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[300px]'>
        <p className=' texte-anim text-shadow '>
          <span className=''>Que serait la technologie, sans mise en valeur ?<br /></span>
          
          
        </p>
        
    
      </div>

      <div className='h-[600px]'></div>

      <div className=' texte-anim bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[300px]'>
        <p className=' text-shadow '>
          
          <span className=''>Un cube qui répondrait à des besoins tout en étant efficace certes</span>
          
        </p>
        
        
    
      </div>
      
      <div className='h-[600px]'></div>

      <div className='bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[300px]'>
        <p className='texte-anim  text-shadow'>
          <span className=''>mais ce cube aurait un problème…</span>
        </p>
      </div>
      
      <div className='h-[600px]'></div>

      <div className=''>
        <p className='texte-anim  bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[300px] text-shadow'>
          <span className=''>il serait complètement</span>
        </p>
        </div>

        <div className='h-[600px]'></div>

        <p className='texte-anim bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[80px] text-shadow'>
          <span className=''>vide</span>
        </p>

        <div className='h-[600px]'></div>

        <p className='texte-anim bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[200px] text-shadow'>
          <span className=''>dénué de sens</span>
        </p>
        
        <div className='h-[600px]'></div>

        <p className='texte-anim bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[200px] text-shadow'>
          <span className=''>et par dessus tout</span>
        </p>
        
        <div className='h-[600px]'></div>

        <p className='texte-anim bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[200px] text-shadow'>
          <span className=''>invisible</span>
        </p>
        
        <div className='h-[600px]'></div>

        <p className='texte-anim bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[200px] text-shadow'>
          <span className=''>parmis les autres technologies...</span>
        </p>

        
        <div className='h-[600px]'></div>

      <div>
        <p className='texte-anim bg-[#1a1a1a] bg-opacity-0 rounded-xl py-5 px-4 font-inter overflow-hidden w-[300px] text-shadow'>
          <span className=''>mais si on y rajoutait une dimension artistique/spéciale qui de plus mettrai en avant l’efficacité du projet ?</span>
        </p>
      </div>

      
        <div className='h-[500px]'></div>

      <div>
        <p className='texte-anim bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[300px] text-shadow'>
          <span className=''>Ce serait un cube qui démontrerait qu’il serait au dessus de la masse sans se justifier car il incarnerait l’innovation de lui même !</span>
        </p>
      </div>

      
        <div className='h-[500px]'></div>
      <div>
        <p className='texte-anim bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[300px] text-shadow'>
          <span className=''>Notre approche ? Créer des projets qui excellent par leur efficacité, leur qualité et leur innovation.</span>
        </p>
      </div>

      
        <div className='h-[500px]'></div>

      
      <div className='texte-anim bg-[#1a1a1a] rounded-xl py-5 px-4 font-inter overflow-hidden w-[400px] text-center text-shadow mb-10'>
          <span className=''>Un projet ? Une collaboration ? Une question ?</span>
      </div>
    </section>
  );
}
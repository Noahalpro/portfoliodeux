'use client'
import Image from "next/image";

function Experiences () {
    return (
        <div className="bg-[#1a1a1a] text-[#e0e0e0] py-20 px-4 font-inter overflow-hidden">
         <div className="max-w-6xl mx-auto text-center px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-[#f0f0f0] mb-16 tracking-[-0.02em]">Mon parcours et compéteneces</h2>
            
        <ul className="flex flex-col justify-center gap-10">
            
            <li className="lg:flex border-3 border-[#4a4a4a] py-5 px-5 rounded-xl ">
                <div>
                
                <h2 className="font-bold text-2xl ">Web developpeur</h2>
                
                <Image src="/open.png" alt="html5" width={250} height={250} className="w-[250px] h-auto object-contain mx-auto"/>
                <h3 className="text-gray-400">- 2025 -</h3>
                </div>
                <p>Je suis formé à créer des sites et applications web modernes, aussi bien côté client (front-end) que serveur (back-end). Je maîtrise HTML5, CSS3 et JavaScript pour construire des interfaces dynamiques avec React.js. Je développe également des API avec Node.js et Express, et je gère les données via MongoDB. Grâce à des projets concrets, j’ai appris à concevoir des applications complètes et à les déployer, tout en construisant un portfolio professionnel.</p>
            </li>
            <li>
                <h2 className="font-bold text-2xl mb-10">Stack Maîtrisée :</h2></li>
            <li className="flex-col justify-center items-center border-3 border-[#4a4a4a] py-5 px-5 rounded-xl">
            

                <div className="flex flex-col justify-center items-center gap-8">
                    
                
                <Image src="/tail.png" alt="html5" width={200} height={200} className="w-[200px] h-auto object-contain "/>
                
                <h3 className="text-gray-400">Front-end</h3>
                
                <p> 
<span className="font-bold">HTML5: </span>Le langage de base pour structurer les pages web (titres, paragraphes, images, formulaires…).

<br /><br /><span className="font-bold">CSS3: </span>
Permet de styliser les pages : mise en page, couleurs, animations, responsive design (adapté aux mobiles/tablettes).
                <br /><br /><span className="font-bold">Tailwind CSS: </span>Framework CSS utilitaire qui me permet de créer rapidement des interfaces modernes, responsives et cohérentes, tout en optimisant la productivité.
</p>

                </div>
                
            </li>
            <li className="flex-col justify-center items-center border-3 border-[#4a4a4a] py-5 px-5 rounded-xl">
            
                

                <div className="flex flex-col justify-center items-center gap-8">
                
                <Image src="/reactjs.png" alt="html5" width={200} height={200} className="w-[200px] h-auto object-contain "/>
                
                <h3 className="text-gray-400">Front-end</h3>

                <p> <span className="font-bold">JS: </span> Langage de programmation qui rend les sites interactifs : animations, gestion des clics, formulaires, appels API, etc.
                    <br /><br /><span className="font-bold">React: </span> Bibliothèque JavaScript pour construire des interfaces modernes en composants. Utilisation des hooks (useState, useEffect…), du routing et de la gestion d’état.
                <br /><br /><span className="font-bold">Next.js: </span>Next.js : Framework React puissant que j’utilise pour créer des applications web performantes, SEO-friendly et scalables. Il facilite le rendu côté serveur (SSR), la génération statique (SSG) et la navigation rapide, tout en offrant une structure claire 
                </p>
                

                </div>
                
            </li>
            <li className="flex-col justify-center items-center border-3 border-[#4a4a4a] py-5 px-5 rounded-xl">
            
                

                <div className="flex flex-col justify-center items-center gap-8">
                
                <Image src="/jsmongo.png" alt="html5" width={200} height={200} className="w-[200px] "/>
                
                <h3 className="text-gray-400">Back-end</h3>
            
<p> <span className="font-bold">Node.js: </span> Environnement d’exécution JavaScript côté serveur. Il permet de gérer les requêtes, fichiers, utilisateurs, etc.
                    <br /><span className="font-bold">Express.js: </span>
Framework minimaliste pour Node.js. Il facilite la création d’API REST, la gestion des routes et des middlewares.

                    <br /><span className="font-bold">MongoDB: </span>
                    Base de données NoSQL, orientée documents. Idéale pour stocker des objets JavaScript (JSON) de façon flexible et scalable.
</p>

                </div>
                
            </li>
            
            <li className="flex-col justify-center items-center border-3 border-[#4a4a4a] py-5 px-5 rounded-xl">
            
                

                <div className="flex flex-col justify-center items-center gap-8">
                
                <Image src="/blenderthree.png" alt="html5" width={200} height={200} className="w-[200px] "/>
                
                <h3 className="text-gray-400">Conception 3D</h3>
            
                <p>
                <span className="font-bold">Three.js: </span>
                Librairie JavaScript que j’utilise pour créer des expériences web 3D interactives directement dans le navigateur. Elle me permet d’animer des scènes, gérer des caméras, lumières et objets 3D, et de donner vie à des interfaces immersives en temps réel avec WebGL.

                    <br /><span className="font-bold">Blender: </span>
                    Logiciel de modélisation 3D que j’utilise pour concevoir des objets, décors ou animations optimisés pour le web ou les moteurs temps réel. Il me permet de créer, texturer, rigguer et animer des modèles que j’intègre ensuite dans des projets interactifs (ex : via Three.js).
                    </p>

                </div>
                
            </li>
        </ul>
        
        </div>
        </div>
    )
}

export default Experiences;
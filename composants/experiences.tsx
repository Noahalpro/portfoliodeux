'use client'
import Image from "next/image";

function Experiences () {
    return (
        <div className="bg-[#1a1a1a] text-[#e0e0e0] py-20 px-4 font-inter overflow-hidden">
         <div className="max-w-6xl mx-auto text-center px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-[#f0f0f0] mb-16 tracking-[-0.02em]">Mon parcours et compéteneces</h2>
            
        <ul className="flex flex-col justify-center gap-10">
            <li className="lg:flex items-center border-3 bg-[#282828] border-[#4a4a4a] py-5 px-5 rounded-xl">
                <div>
                
                <h2 className="font-bold text-2xl ">Certified Solutions Architect – Associate</h2>
                
                <Image src="/logoaws.png" alt="aws" width={200} height={200} className="w-[90px] h-auto object-contain mx-auto"/>
                <h3 className="text-gray-400">- 2025 -</h3>
                </div>
                <p className="px-5">En tant que Solution Architect AWS, j’ai appris à concevoir des architectures Cloud modernes, sécurisées et évolutives.
Je maîtrise les services clés d’AWS comme EC2, S3, RDS, VPC et IAM, ainsi que les technologies serverless telles que Lambda, API Gateway, DynamoDB et CloudFront, qui permettent de créer des applications hautement disponibles sans gestion d’infrastructure.
J’applique les bonnes pratiques DevOps avec CloudFormation, CI/CD et le monitoring via CloudWatch, afin de garantir automatisation, performance et optimisation des coûts.</p>
            </li>
            <li className="lg:flex border-3 bg-[#282828] border-[#4a4a4a] py-5 px-5 rounded-xl ">
                <div>
                
                <h2 className="font-bold text-2xl ">Web developpeur</h2>
                
                <Image src="/open.png" alt="html5" width={250} height={250} className="w-[250px] h-auto object-contain mx-auto"/>
                <h3 className="text-gray-400">- 2025 -</h3>
                </div>
                <p className="px-5">Je suis formé à créer des sites et applications web modernes, aussi bien côté client (front-end) que serveur (back-end). Je maîtrise HTML5, CSS3 et JavaScript pour construire des interfaces dynamiques avec React.js. Je développe également des API avec Node.js et Express, et je gère les données via MongoDB. Grâce à des projets concrets, j’ai appris à concevoir des applications complètes et à les déployer, tout en construisant un portfolio professionnel.</p>
            </li>
            <li>
                <h2 className="font-bold text-2xl mb-10">Stack Maîtrisée :</h2></li>
            <li className="flex justify-center items-center border-3 border-[#4a4a4a] py-5 px-5 rounded-xl bg-[#282828]">
            

                <div className="flex flex-col justify-center items-center gap-8">
                    
                
                <h3 className="text-gray-400">Front-end</h3>
                <Image src="/frontendlogo.png" alt="html5" width={200} height={200} className="w-[200px] h-auto object-contain "/>
                
                

                </div>
                <div className="flex flex-col justify-center items-center gap-8">
                <h3 className="text-gray-400">Backend</h3>
                
                <Image src="/backpng.png" alt="html5" width={200} height={200} className="w-[200px] h-auto object-contain "/>

                
                

                </div>
                
            </li>
            <li className="flex-col justify-center items-center border-3 border-[#4a4a4a] py-5 px-5 rounded-xl bg-[#282828]">
            
                

                <div className="flex flex-col justify-center items-center gap-8">
                    
                <h3 className="text-gray-400">Infrastructure</h3>
                
                <Image src="/infrapng.png" alt="infra" width={250} height={250} className="w-[250px] h-auto object-contain "/>

                
                

                </div>
                
            </li>
            
            <li className="flex-col justify-center items-center border-3 border-[#4a4a4a] py-5 px-5 rounded-xl bg-[#282828]">
            
                

                <div className="flex flex-col justify-center items-center gap-8">
                
                <h3 className="text-gray-400">Conception 3D</h3>
                <Image src="/blenderthree.png" alt="html5" width={200} height={200} className="w-[200px] "/>
            
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

'use client';
import Link from "next/link";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark  } from '@fortawesome/free-solid-svg-icons';

import { useState } from "react";


export  function Header() {
    
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
    return (
        <nav className="relative max-w mx-auto h-20 flex flex-row justify-between items-center bg-[#ECECEC]">
            <div className="z-15">
                
                <Link href="/" className="text-neutral-750 font-bold text-xl hover:text-purple-400 transition-colors z-15 ">
                NoahNzbb
                </Link>
            </div>



            
    
        <div className="flex z-15">
            
                
        <button onClick={toggleMenu} className="text-xl z-30">
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
        </button>
        

            {isOpen && (
                <ul className="flex w-fit gap-5 z-30">
                    
                    <li>
                        
                <Link href="/contact" className=" text-neutral-750 font-bold text-l hover:text-purple-400 transition-colors z-15 ">
                Contact
                </Link>
                    </li>

                    <li>
                        
                    
                <Link href="/" className="text-neutral-750 font-bold text-l hover:text-purple-400 transition-colors z-15 ">
                Projets
                
                </Link>


                    </li>

                </ul>
                
            )
        }

        </div>
    
        
        </nav>
    );
}

'use client';
import Link from "next/link";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark  } from '@fortawesome/free-solid-svg-icons';

import { useState } from "react";


export  function Header() {
    
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
    return (

        

        <nav className="max-w mx-auto h-20 flex flex-row justify-between items-center ">
            <div className="relative z-15 ">
                
                <Link href="/" className="text-neutral-750 font-bold text-xl hover:text-purple-400 transition-colors relative z-15 ">
                NoahNzb
                </Link>
            </div>



            
            <div>

                
        <button onClick={toggleMenu} className="text-xl z-20">
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
        </button>
        

            {isOpen && (
                <ul className="flex gap-5">
                    <li>
                        
                <Link href="/contact" className="text-neutral-750 font-bold text-l hover:text-purple-400 transition-colors relative z-15 ">
                Contact
                </Link>
                    </li>
                    
                <Link href="/" className="text-neutral-750 font-bold text-l hover:text-purple-400 transition-colors relative z-15 ">
                Projets
                
                </Link>

                </ul>
                
            )
        }
            </div>
        </nav>
    );
}
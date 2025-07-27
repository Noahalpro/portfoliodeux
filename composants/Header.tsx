// components/Header.tsx
'use client';

import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation'; // Utilisation de usePathname pour le répertoire 'app'
import { useState, useEffect } from "react"; // Importe useState et useEffect

export function Header() {
  const pathname = usePathname(); // Obtient le chemin actuel de l'URL

  // Logique pour recharger la page quand on revient à l'accueil
  useEffect(() => {
    // Vérifie si le chemin actuel est la page d'accueil
    if (pathname === '/') {
      // Vérifie si un rechargement a déjà été initié pour cette navigation
      const hasInitiatedReload = sessionStorage.getItem('hasInitiatedHomeReload');

      if (!hasInitiatedReload) {
        // Si non, définit le drapeau et recharge la page
        sessionStorage.setItem('hasInitiatedHomeReload', 'true');
        console.log("Navigation vers la page d'accueil détectée, rechargement unique de la page...");
        window.location.reload();
      } else {
        // Si un rechargement a été initié, efface le drapeau pour les navigations futures.
        // Cela permet un nouveau rechargement si l'utilisateur navigue ailleurs puis revient à l'accueil.
        sessionStorage.removeItem('hasInitiatedHomeReload');
        console.log("Rechargement déjà effectué pour cette navigation vers l'accueil. Drapeaux réinitialisés.");
      }
    } else {
      // Si on navigue hors de la page d'accueil, s'assure que le drapeau est effacé
      // afin que la prochaine fois que l'utilisateur navigue vers l'accueil, cela recharge.
      sessionStorage.removeItem('hasInitiatedHomeReload');
      console.log("Hors de la page d'accueil. Drapeaux de rechargement réinitialisés.");
    }
  }, [pathname]); // Déclenche cet effet chaque fois que le chemin change

  const isContactPage = pathname === '/contact'; // Condition pour le style du header
  const isProjetPage = pathname === '/Projets'; // Condition pour le style du header

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);


  return (
    <nav className={`relative z-20 max-w-full mx-auto h-20 flex flex-row justify-between items-center px-4 ${isContactPage || isProjetPage ? 'bg-[#1a1a1a]' : ''} transition-colors duration-300`}>
        <div className="">
        <Link href="/" className="text-white font-bold text-xl hover:text-purple-400 transition-colors">
          Noah Aldeguer
        </Link>
      </div>

      <ul className="hidden md:flex gap-5">
        <li>
            
        <Link href="/contact" className="text-white font-bold text-lg hover:text-purple-400  transition-colors duration-300 ">
          Contact
        </Link>

        </li>
        <li>

            <Link href="/Projets" className="text-white font-bold text-lg hover:text-purple-400 transition-colors">
          Projets
        </Link>

        </li>
      </ul>

        <div className="text-xl flex gap-5 md:hidden">
            {isOpen && (
  <ul className="flex gap-5">
    <li className="">
            
        <Link href="/contact" className={`text-white font-bold text-lg hover:text-purple-400 transition-colors ${isContactPage  ? 'text-purple-400' : ''}`}>
          Contact
        </Link>

        </li>
        <li className="">

            <Link href="/Projets" className="text-white font-bold text-lg hover:text-purple-400 transition-colors">
          Projets
        </Link>

        </li>
  </ul>
)}
                
        <button onClick={toggleMenu} className="text-xl text-white">
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className="text-white" />

            </button>
        </div>



    </nav>
);
}

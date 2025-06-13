import Link from "next/link";

export  function Header() {
    return (

        

        <nav className="mb-10 h-20 flex flex-row justify-between items-center ">
            <div className="relative z-10 text-white">
                
                <Link href="/" className="relative z-10 text-white">
                NoahNzb
                </Link>
            </div>
            <div>
                <Link href="/contact" className="relative z-10 text-white">
                Contact
                </Link>
            </div>
        </nav>
    );
}
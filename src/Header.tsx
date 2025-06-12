import Link from "next/link";

export  function Header() {
    return (

        

        <nav className="mb-10 h-20 flex flex-row justify-between items-center">
            <div>
                
                <Link href="/">
                NoahNzb
                </Link>
            </div>
            <div>
                <Link href="/contact">
                Contact
                </Link>
            </div>
        </nav>
    );
}
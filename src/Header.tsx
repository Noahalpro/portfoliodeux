import Link from "next/link";

export  function Header() {
    return (

        

        <nav className="p-4 flex flex-row justify-between align-center">
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